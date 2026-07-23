import { useState, useRef, useEffect } from 'react';
import { Play, ListVideo, Lock, CheckCircle2, Download, Copy, KeyRound, Sparkles, FileText, FileType, FileArchive, Search, Link2, ListPlus } from 'lucide-react';
import ProcessingOverlay from './ProcessingOverlay';
import TranscriptViewer from './TranscriptViewer';
import { plainText, aiPrompt, toCSV, toMarkdown } from '../lib/transcriptText';
import ExtraFormats from './ExtraFormats';
import SummarizeButton from './SummarizeButton';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

// Set these to the live Dodo Payments checkout links to enable purchases.
const PACK_CHECKOUT = '';
const PRO_CHECKOUT_MONTHLY = '';
const PRO_CHECKOUT_YEARLY = '';
const PAYMENTS_LIVE = Boolean(PACK_CHECKOUT || PRO_CHECKOUT_MONTHLY || PRO_CHECKOUT_YEARLY);

// Combined-document requests can be large; give the server generous headroom.
const COMBINED_EXPORT_TIMEOUT_MS = 300000;

const formatDuration = (s) => {
  if (!s) return '';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    : `${m}:${String(sec).padStart(2, '0')}`;
};

const slugify = (text) =>
  (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'transcript';

const PlaylistTool = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [licenseKey, setLicenseKey] = useState(() => {
    try { return localStorage.getItem('tf_license') || ''; } catch { return ''; }
  });
  const [keyInput, setKeyInput] = useState('');
  const [showKeyField, setShowKeyField] = useState(false);
  const [keyError, setKeyError] = useState(null);

  // Single-video viewer (parity with the single-video tool)
  const [selectedId, setSelectedId] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null); // fetched transcript data for selectedId
  const [viewerLoading, setViewerLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);
  const [withTimestamps, setWithTimestamps] = useState(true);
  const [exportingSingle, setExportingSingle] = useState(null); // 'docx' | 'pdf'
  const videoCacheRef = useRef(new Map()); // video_id -> transcript data

  // Whole-playlist bulk export
  const [exporting, setExporting] = useState(null); // {done, total, currentTitle}
  const [stopChoice, setStopChoice] = useState(null); // {results, failures, total, format}
  const cancelRef = useRef(false);

  // Pro expansion state
  const [inputMode, setInputMode] = useState('link'); // 'link' (playlist/channel URL) | 'list' (pasted video URLs)
  const [listInput, setListInput] = useState('');
  const [exportLanguage, setExportLanguage] = useState('');
  const [bulkLangs, setBulkLangs] = useState(null);
  const [bulkLangsLoading, setBulkLangsLoading] = useState(false);
  const [searchAllQuery, setSearchAllQuery] = useState('');
  const [searchAllResults, setSearchAllResults] = useState(null);
  const [plSummary, setPlSummary] = useState(null);
  const [plSummaryState, setPlSummaryState] = useState('idle');

  const fetchPlaylist = async (playlistUrl, key) => {
    setLoading(true);
    setError(null);
    setPlaylist(null);
    setSelectedId(null);
    setCurrentVideo(null);
    videoCacheRef.current = new Map();
    try {
      const body = { playlist_url: playlistUrl };
      if (key) body.license_key = key;
      const response = await fetch(`${BACKEND_URL}/api/playlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        setPlaylist(data);
        return data;
      }
      setError(data.error || 'Could not load this playlist.');
      return null;
    } catch {
      setError('Failed to connect to server. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const parseVideoList = (text) => {
    const ids = [];
    const seen = new Set();
    for (const m of text.matchAll(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/g)) {
      if (!seen.has(m[1])) { seen.add(m[1]); ids.push(m[1]); }
    }
    for (const line of text.split(/\s+/)) {
      if (/^[a-zA-Z0-9_-]{11}$/.test(line) && !seen.has(line)) { seen.add(line); ids.push(line); }
    }
    return ids.slice(0, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMode === 'list') {
      const ids = parseVideoList(listInput);
      if (ids.length === 0) {
        setError('No YouTube video links found — paste one link per line.');
        return;
      }
      setError(null);
      setSearchAllResults(null);
      setPlSummary(null);
      const licensed = Boolean(licenseKey);
      setPlaylist({
        playlist_id: null,
        isCustomList: true,
        title: `My video list (${ids.length})`,
        videos: ids.map((id) => ({ video_id: id, title: id, duration_seconds: 0, playable: true })),
        video_count: ids.length,
        unlocked_ids: licensed ? ids : ids.slice(0, 2),
        licensed,
        free_limit: 2,
        success: true,
      });
      return;
    }
    if (!url.trim()) return;
    setSearchAllResults(null);
    setPlSummary(null);
    await fetchPlaylist(url.trim(), licenseKey);
  };

  const applyKey = async () => {
    const key = keyInput.trim();
    if (!key) return;
    setKeyError(null);
    const data = await fetchPlaylist(url.trim() || `https://www.youtube.com/playlist?list=${playlist?.playlist_id}`, key);
    if (data && data.licensed) {
      setLicenseKey(key);
      try { localStorage.setItem('tf_license', key); } catch { /* private mode */ }
      setShowKeyField(false);
    } else if (data) {
      setKeyError('That license key is not valid or has expired.');
    }
  };

  // ---- Single-video viewer ---------------------------------------------------

  // Fetch one video's transcript for the viewer (public endpoint — never spends
  // Pro quota; viewing individual videos is as free as the single-video tool).
  const loadVideoIntoViewer = async (videoId) => {
    if (!videoId) return;
    setSelectedId(videoId);
    setError(null);
    const cached = videoCacheRef.current.get(videoId);
    if (cached) {
      setCurrentVideo(cached);
      return;
    }
    setViewerLoading(true);
    setCurrentVideo(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: `https://youtu.be/${videoId}` }),
      });
      const data = await response.json();
      if (data.transcript) {
        videoCacheRef.current.set(videoId, data);
        setCurrentVideo(data);
      } else if (data.error_type === 'rate_limited') {
        setError('You’re switching fast — please wait about 30 seconds and try again.');
      } else {
        setError(data.error || 'No transcript available for this video.');
      }
    } catch {
      setError('Failed to load this transcript. Please try again.');
    } finally {
      setViewerLoading(false);
    }
  };

  // Auto-load the first unlocked video whenever a playlist loads.
  useEffect(() => {
    if (!playlist) return;
    const first = playlist.unlocked_ids[0];
    if (first) loadVideoIntoViewer(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.playlist_id]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveBlob = (blob, filename) => {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const singleName = (format) => `${slugify(currentVideo?.video_title || currentVideo?.video_id)}.${format}`;

  const downloadText = (content, format) => {
    saveBlob(new Blob([content], { type: 'text/plain' }), singleName(format));
  };

  // "This video" Word/PDF — identical to the single-video tool's export.
  const exportSingle = async (format) => {
    if (!currentVideo || exportingSingle) return;
    setExportingSingle(format);
    try {
      const response = await fetch(`${BACKEND_URL}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: `https://youtu.be/${currentVideo.video_id}`, format }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Export failed. Please try again.');
        return;
      }
      saveBlob(await response.blob(), singleName(format));
    } catch {
      setError('Export failed. Please try again.');
    } finally {
      setExportingSingle(null);
    }
  };

  // ---- Whole-playlist bulk export --------------------------------------------

  // Package already-fetched transcripts into the chosen format and download.
  // Shared by the normal completion path and "Download partial" after Stop.
  const packageResults = async (results, failures, format) => {
    const total = results.length;
    if (format === 'zip') {
      // JSZip is only needed for ZIP exports — load it on demand.
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      results.forEach((r, i) => {
        const base = `${String(i + 1).padStart(2, '0')}-${slugify(r.title)}`;
        zip.file(`${base}.txt`, r.transcript);
        if (r.srt) zip.file(`${base}.srt`, r.srt);
        zip.file(`${base}.md`, toMarkdown({ video_title: r.title, transcript: r.transcript, language: r.language, word_count: r.word_count, video_id: r.video_id }));
        if (r.segments?.length) zip.file(`${base}.csv`, toCSV(r.segments));
      });
      const combined = results.map((r) => `=== ${r.title} (https://youtu.be/${r.video_id}) ===\n\n${r.transcript}\n`);
      zip.file('_all-transcripts-combined.txt', combined.join('\n\n'));
      if (failures.length) {
        zip.file('_skipped-videos.txt', `No transcript available for:\n${failures.join('\n')}`);
      }
      setExporting({ done: total, total, currentTitle: 'Packaging ZIP…' });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveBlob(blob, `${slugify(playlist.title)}-transcripts.zip`);
    } else if (format === 'txt') {
      // Combined plain text — built entirely client-side, instant.
      setExporting({ done: total, total, currentTitle: 'Building combined text…' });
      const header = `${playlist.title}\n${results.length} videos • Generated by transcriptflow.io\n`;
      const combined = results.map(
        (r) => `=== ${r.title} (https://youtu.be/${r.video_id}) ===\n\n${r.transcript}\n`
      );
      saveBlob(new Blob([header + '\n' + combined.join('\n\n')], { type: 'text/plain' }), `${slugify(playlist.title)}-combined.txt`);
    } else if (format === 'pdfzip' || format === 'docxzip') {
      // One document per video, zipped server-side.
      const docFormat = format === 'pdfzip' ? 'pdf' : 'docx';
      setExporting({ done: total, total, currentTitle: `Building ${docFormat.toUpperCase()}s…` });
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), COMBINED_EXPORT_TIMEOUT_MS);
      try {
        const response = await fetch(`${BACKEND_URL}/api/playlist/export-docs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            format: docFormat,
            playlist_title: playlist.title,
            license_key: licenseKey || undefined,
            videos: results.map((r) => ({
              video_id: r.video_id, title: r.title, transcript: r.transcript,
              language: r.language, word_count: r.word_count,
            })),
          }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || 'Document export failed. Please try again.');
        } else {
          saveBlob(await response.blob(), `${slugify(playlist.title)}-${docFormat}s.zip`);
        }
      } catch (err) {
        setError(err.name === 'AbortError'
          ? 'The document export is taking too long — try fewer videos or the ZIP export.'
          : 'Document export failed. Please try again.');
      } finally {
        clearTimeout(timer);
      }
    } else {
      // Combined PDF / Word: one formatting call, no extra YouTube fetches needed.
      setExporting({ done: total, total, currentTitle: `Building combined ${format.toUpperCase()}…` });
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), COMBINED_EXPORT_TIMEOUT_MS);
      try {
        const response = await fetch(`${BACKEND_URL}/api/playlist/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            format,
            playlist_title: playlist.title,
            license_key: licenseKey || undefined,
            videos: results.map((r) => ({
              video_id: r.video_id,
              title: r.title,
              transcript: r.transcript,
              language: r.language,
              word_count: r.word_count,
            })),
          }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || 'Combined export failed. Please try again.');
        } else {
          saveBlob(await response.blob(), `${slugify(playlist.title)}-combined.${format}`);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('The combined document is taking too long — try the ZIP or Word export, or a smaller playlist.');
        } else {
          setError('Combined export failed. Please try again.');
        }
      } finally {
        clearTimeout(timer);
      }
    }
    setExporting(null);
  };

  // Shared bulk-fetch loop: fills results (and the viewer cache when fetching
  // the default language). targetLanguage skips the cache so translated exports
  // don't pollute the original-language viewer.
  const fetchTranscripts = async (ids, byId, targetLanguage) => {
    const results = []; // {video_id, title, transcript, srt, language, word_count, segments}
    const failures = [];
    let quotaHit = false;

    for (let i = 0; i < ids.length; i++) {
      if (cancelRef.current) break;
      const id = ids[i];
      setExporting({ done: i, total: ids.length, currentTitle: byId[id]?.title || id });
      if (!targetLanguage) {
        const cached = videoCacheRef.current.get(id);
        if (cached && cached.transcript) {
          results.push({
            video_id: id,
            title: cached.video_title || byId[id]?.title || id,
            transcript: cached.transcript,
            srt: cached.srt,
            language: cached.language,
            word_count: cached.word_count,
            segments: cached.segments,
          });
          continue;
        }
      }
      try {
        const endpoint = playlist.licensed ? '/api/playlist/transcript' : '/api/transcript';
        const body = { video_url: `https://youtu.be/${id}` };
        if (playlist.licensed) body.license_key = licenseKey;
        if (targetLanguage) body.target_language = targetLanguage;
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (data.error_type === 'quota_exceeded') {
          quotaHit = true;
          setError('Your Pro export quota is reached — the remaining videos were skipped. Quota resets daily/monthly.');
          break;
        }
        if (!data.transcript) {
          failures.push(byId[id]?.title || id);
          continue;
        }
        if (!targetLanguage) videoCacheRef.current.set(id, data);
        results.push({
          video_id: id,
          title: data.video_title || byId[id]?.title || id,
          transcript: data.transcript,
          srt: data.srt,
          language: data.language,
          word_count: data.word_count,
          segments: data.segments,
        });
      } catch {
        failures.push(byId[id]?.title || id);
      }
    }
    return { results, failures, quotaHit };
  };

  const runExport = async (format) => {
    if (!playlist || exporting) return;
    cancelRef.current = false;
    const ids = playlist.unlocked_ids;
    const byId = Object.fromEntries(playlist.videos.map((v) => [v.video_id, v]));
    setError(null);

    const { results, failures, quotaHit } = await fetchTranscripts(ids, byId, exportLanguage || null);

    if (cancelRef.current) {
      setExporting(null);
      if (results.length > 0) {
        // Let the user choose: download what's fetched, or discard.
        setStopChoice({ results, failures, total: ids.length, format });
      }
      return;
    }

    if (results.length === 0) {
      if (!quotaHit) setError('None of these videos have transcripts available.');
      setExporting(null);
      return;
    }

    await packageResults(results, failures, format);
  };

  // Fetch everything (original language) into the local cache — powers
  // cross-playlist search and playlist summaries.
  const fetchAllForAnalysis = async () => {
    if (!playlist || exporting) return null;
    cancelRef.current = false;
    const ids = playlist.unlocked_ids;
    const byId = Object.fromEntries(playlist.videos.map((v) => [v.video_id, v]));
    const { results } = await fetchTranscripts(ids, byId, null);
    setExporting(null);
    return results;
  };

  const runPlaylistSearch = async () => {
    const q = searchAllQuery.trim().toLowerCase();
    if (!q || !playlist) return;
    // Make sure everything unlocked is fetched first
    const missing = playlist.unlocked_ids.some((id) => !videoCacheRef.current.get(id));
    if (missing) {
      const r = await fetchAllForAnalysis();
      if (!r) return;
    }
    const out = [];
    for (const id of playlist.unlocked_ids) {
      const data = videoCacheRef.current.get(id);
      if (!data?.transcript) continue;
      const hits = data.transcript.split('\n').filter((l) => l.toLowerCase().includes(q)).slice(0, 5);
      if (hits.length) out.push({ video_id: id, title: data.video_title || id, hits });
    }
    setSearchAllResults(out);
  };

  const summarizePlaylist = async () => {
    if (!playlist || plSummaryState === 'loading') return;
    setPlSummaryState('loading');
    setPlSummary(null);
    try {
      const results = await fetchAllForAnalysis();
      if (!results || results.length === 0) { setPlSummaryState('idle'); return; }
      const r = await fetch(`${BACKEND_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: licenseKey,
          mode: 'playlist',
          playlist_title: playlist.title,
          videos: results.map((v) => ({ video_id: v.video_id, title: v.title, transcript: v.transcript })),
        }),
      });
      const d = await r.json();
      if (d.summary) { setPlSummary(d); setPlSummaryState('done'); }
      else { setError(d.error || 'Summary failed. Please try again.'); setPlSummaryState('idle'); }
    } catch {
      setError('Summary failed. Please try again.');
      setPlSummaryState('idle');
    }
  };

  const lockedCount = playlist ? playlist.video_count - playlist.unlocked_ids.length : 0;
  const isUnlocked = (id) => playlist?.unlocked_ids.includes(id);

  const bulkButtons = [
    { fmt: 'zip', label: 'ZIP (TXT · SRT · MD · CSV)', Icon: FileArchive },
    { fmt: 'txt', label: 'Combined TXT', Icon: FileText },
    { fmt: 'pdf', label: 'Combined PDF', Icon: FileType },
    { fmt: 'docx', label: 'Combined Word', Icon: FileType },
    { fmt: 'pdfzip', label: 'PDF per video (ZIP)', Icon: FileArchive },
    { fmt: 'docxzip', label: 'Word per video (ZIP)', Icon: FileArchive },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setInputMode('link')}
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${inputMode === 'link' ? 'bg-foreground text-background' : 'btn-secondary'}`}>
            <Link2 className="w-3.5 h-3.5" /> Playlist or channel link
          </button>
          <button type="button" onClick={() => setInputMode('list')}
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${inputMode === 'list' ? 'bg-foreground text-background' : 'btn-secondary'}`}>
            <ListPlus className="w-3.5 h-3.5" /> Paste video links
          </button>
        </div>
        {inputMode === 'link' ? (
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <ListVideo className="w-5 h-5 text-red-500" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a playlist URL (list=…) or channel URL (@name)"
              className="input-modern w-full py-4 text-lg"
              style={{ paddingLeft: '3rem', paddingRight: '1rem' }}
              required
            />
          </div>
        ) : (
          <textarea
            value={listInput}
            onChange={(e) => setListInput(e.target.value)}
            placeholder={"One YouTube link per line — up to 100 videos\nhttps://youtu.be/…\nhttps://www.youtube.com/watch?v=…"}
            rows={4}
            className="input-modern w-full py-3 px-4 text-base font-mono"
            required
          />
        )}
        <button
          type="submit"
          disabled={loading || (inputMode === 'link' ? !url.trim() : !listInput.trim())}
          className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
              <span>Loading playlist…</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>{inputMode === 'list' ? 'Load Videos' : 'Load Playlist'}</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {playlist && (
        <div className="mt-8 space-y-6 text-left">
          {/* Playlist header */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold">{playlist.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {playlist.video_count} videos
              {playlist.licensed
                ? ' — all unlocked with Pro ✨'
                : ` — first ${playlist.free_limit} free, ${lockedCount} locked`}
            </p>
          </div>

          {/* Upgrade card (free users with locked videos) */}
          {!playlist.licensed && lockedCount > 0 && (
            <div className="glass-strong p-6 rounded-xl border border-primary/30">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg gradient-bg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-1">
                    Unlock all {playlist.video_count} videos with TranscriptFlow Pro
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="text-foreground font-medium">Course Pack — $4.99 one-time</span> (100 video credits, valid 12 months, no subscription)
                    {' '}or <span className="text-foreground font-medium">Pro — $6.99/month</span> (1,000 videos/mo, AI summaries, API).
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {PAYMENTS_LIVE ? (
                      <>
                        {PACK_CHECKOUT && (
                          <a href={PACK_CHECKOUT} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                            Course Pack — $4.99 once
                          </a>
                        )}
                        {PRO_CHECKOUT_MONTHLY && (
                          <a href={PRO_CHECKOUT_MONTHLY} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                            Pro — $6.99/mo
                          </a>
                        )}
                        {PRO_CHECKOUT_YEARLY && (
                          <a href={PRO_CHECKOUT_YEARLY} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                            $49/year (5 months free)
                          </a>
                        )}
                      </>
                    ) : (
                      <span className="text-sm px-3 py-2 rounded-lg glass text-muted-foreground">
                        🚀 Pro is launching soon — email support@transcriptflow.io for early access
                      </span>
                    )}
                    <button
                      onClick={() => setShowKeyField(!showKeyField)}
                      className="text-sm text-primary hover:underline flex items-center space-x-1"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>I have a license key</span>
                    </button>
                  </div>
                  {showKeyField && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Paste your license key"
                        className="input-modern flex-1 min-w-[220px] py-2 px-3 text-sm"
                      />
                      <button onClick={applyKey} disabled={loading} className="btn-primary text-sm disabled:opacity-50">
                        Activate
                      </button>
                      {keyError && <p className="w-full text-xs text-red-700">{keyError}</p>}
                      <p className="w-full text-xs text-muted-foreground">
                        Lost your key? Retrieve it anytime from the{' '}
                        <a href="https://customer.dodopayments.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          customer portal
                        </a>{' '}
                        (sign in with your purchase email).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quota / credits display for licensed users */}
          {playlist.licensed && (
            <p className="text-xs text-muted-foreground text-center">
              {playlist.plan === 'pack'
                ? <>Course Pack active — <span className="font-mono font-medium text-foreground">{playlist.credits_remaining}</span> credits left (1 credit = 1 video, AI summary = 2).{' '}</>
                : <>Pro license active — quota: 200 videos/day, 1,000 videos/month.{' '}</>}
              <a href="https://customer.dodopayments.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Manage billing & keys
              </a>
            </p>
          )}

          {/* Transcript viewer with a video switcher — same experience as single video */}
          <div className="glass p-4 sm:p-6 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-semibold text-base truncate max-w-full sm:max-w-[55%]">
                {currentVideo?.video_title || (viewerLoading ? 'Loading…' : 'Transcript')}
              </h4>
              <select
                aria-label="Choose a video"
                value={selectedId || ''}
                onChange={(e) => loadVideoIntoViewer(e.target.value)}
                className="input-modern text-sm py-2 px-3 bg-background/80 max-w-[260px]"
              >
                {playlist.videos.map((v, i) => {
                  const unlocked = isUnlocked(v.video_id);
                  const label = `${String(i + 1).padStart(2, '0')}. ${v.title}`;
                  return (
                    <option key={v.video_id} value={v.video_id} disabled={!unlocked}>
                      {unlocked ? label : `🔒 ${label}`}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* "This video" actions — identical to the single-video tool */}
            {currentVideo && (
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center rounded-lg overflow-hidden border border-border/60">
                  <button
                    onClick={() => copyToClipboard(withTimestamps ? currentVideo.transcript : plainText(currentVideo.transcript))}
                    className="btn-secondary flex items-center space-x-2 text-sm rounded-none border-0"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={() => setWithTimestamps(!withTimestamps)}
                    className="text-xs px-2.5 py-2.5 bg-background/60 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    title="Toggle timestamps in copied text"
                  >
                    {withTimestamps ? '[00:00] on' : '[00:00] off'}
                  </button>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(aiPrompt(currentVideo.transcript, currentVideo.video_title));
                      setCopiedAI(true);
                      setTimeout(() => setCopiedAI(false), 2000);
                    } catch (err) { console.error('Failed to copy:', err); }
                  }}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                  title="Copy the transcript wrapped in a ready-to-paste AI summarize prompt"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{copiedAI ? 'Copied!' : 'Copy for AI'}</span>
                </button>
                <button onClick={() => downloadText(currentVideo.transcript, 'txt')} className="btn-secondary flex items-center space-x-2 text-sm">
                  <Download className="w-4 h-4" />
                  <span>TXT</span>
                </button>
                {currentVideo.srt && (
                  <button onClick={() => downloadText(currentVideo.srt, 'srt')} className="btn-secondary flex items-center space-x-2 text-sm">
                    <Download className="w-4 h-4" />
                    <span>SRT</span>
                  </button>
                )}
                {currentVideo.vtt && (
                  <button onClick={() => downloadText(currentVideo.vtt, 'vtt')} className="btn-secondary flex items-center space-x-2 text-sm">
                    <Download className="w-4 h-4" />
                    <span>VTT</span>
                  </button>
                )}
                <button onClick={() => exportSingle('docx')} disabled={!!exportingSingle} className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50">
                  {exportingSingle === 'docx'
                    ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    : <Download className="w-4 h-4" />}
                  <span>{exportingSingle === 'docx' ? 'Preparing…' : 'Word'}</span>
                </button>
                <button onClick={() => exportSingle('pdf')} disabled={!!exportingSingle} className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50">
                  {exportingSingle === 'pdf'
                    ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    : <Download className="w-4 h-4" />}
                  <span>{exportingSingle === 'pdf' ? 'Preparing…' : 'PDF'}</span>
                </button>
                <ExtraFormats payload={currentVideo} />
                <SummarizeButton videoUrl={`https://youtu.be/${currentVideo.video_id}`} />
              </div>
            )}

            {viewerLoading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent mr-3"></div>
                <span className="text-sm">Fetching transcript…</span>
              </div>
            ) : currentVideo ? (
              <TranscriptViewer transcript={currentVideo.transcript} videoId={currentVideo.video_id} />
            ) : null}
          </div>

          {/* Whole-playlist export */}
          <div className="glass p-4 sm:p-6 rounded-xl">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
              <h4 className="font-semibold text-base">
                Download the whole playlist
                <span className="text-sm font-normal text-muted-foreground">
                  {' '}— {playlist.licensed ? `all ${playlist.unlocked_ids.length} videos` : `first ${playlist.unlocked_ids.length} free`}
                </span>
              </h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {bulkButtons.map(({ fmt, label, Icon }) => (
                <button
                  key={fmt}
                  onClick={() => runExport(fmt)}
                  disabled={!!exporting}
                  className="btn-primary flex items-center space-x-2 text-sm disabled:opacity-50 whitespace-nowrap"
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <select
                aria-label="Translate exports to"
                value={exportLanguage}
                disabled={!!exporting}
                onFocus={async () => {
                  if (bulkLangs || bulkLangsLoading || !playlist.unlocked_ids[0]) return;
                  setBulkLangsLoading(true);
                  try {
                    const r = await fetch(`${BACKEND_URL}/api/languages`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ video_url: `https://youtu.be/${playlist.unlocked_ids[0]}` }),
                    });
                    const d = await r.json();
                    setBulkLangs(d.translation_languages || []);
                  } catch { setBulkLangs([]); } finally { setBulkLangsLoading(false); }
                }}
                onChange={(e) => setExportLanguage(e.target.value)}
                className="input-modern text-sm py-2 px-3 max-w-[240px]"
              >
                <option value="">{bulkLangsLoading ? 'Loading languages…' : '🌐 Export in original language'}</option>
                {(bulkLangs || []).map((l) => (
                  <option key={l.language_code} value={l.language_code}>Translate all to {l.language}</option>
                ))}
              </select>
              {playlist.licensed ? (
                <button onClick={summarizePlaylist} disabled={plSummaryState === 'loading' || !!exporting}
                  className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50">
                  {plSummaryState === 'loading'
                    ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    : <Sparkles className="w-4 h-4" />}
                  <span>{plSummaryState === 'loading' ? 'Summarizing…' : 'AI Summary of the playlist'}</span>
                </button>
              ) : (
                <a href="/pricing" className="btn-secondary flex items-center space-x-2 text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Summary <span className="text-xs text-muted-foreground">(Pro)</span></span>
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Very long playlists in non-Latin languages can produce large PDFs — Combined Word or TXT stays small.
              Translated exports fetch each video in the chosen language.
            </p>
          </div>

          {/* Playlist AI summary result */}
          {plSummary && (
            <div className="glass p-5 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Playlist Summary</p>
                <span className="text-xs text-muted-foreground font-mono">{plSummary.summaries_used}/{plSummary.summaries_limit} this month</span>
              </div>
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{plSummary.summary}</div>
            </div>
          )}

          {/* Search across every transcript in the playlist */}
          <div className="glass p-4 sm:p-6 rounded-xl">
            <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" /> Search across the whole playlist
            </h4>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={searchAllQuery}
                onChange={(e) => setSearchAllQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') runPlaylistSearch(); }}
                placeholder="Find a phrase in every video…"
                className="input-modern flex-1 min-w-[220px] py-2 px-3 text-sm"
              />
              <button onClick={runPlaylistSearch} disabled={!!exporting || !searchAllQuery.trim()}
                className="btn-primary text-sm disabled:opacity-50">
                Search
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Searches the {playlist.unlocked_ids.length} unlocked videos — transcripts are fetched first if needed{playlist.licensed ? ' (counts toward your quota once; repeats are cached)' : ''}.
            </p>
            {searchAllResults !== null && (
              <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                {searchAllResults.length === 0 && (
                  <p className="text-sm text-muted-foreground">No matches found.</p>
                )}
                {searchAllResults.map((r) => (
                  <div key={r.video_id}>
                    <p className="text-sm font-medium mb-1 truncate">{r.title}</p>
                    <div className="space-y-1">
                      {r.hits.map((line, i) => {
                        const m = line.match(/^\[(\d+):(\d{2})\]/);
                        const t = m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 0;
                        return (
                          <a key={i} href={`https://youtu.be/${r.video_id}?t=${t}`} target="_blank" rel="noopener noreferrer"
                             className="block text-xs text-muted-foreground hover:text-foreground font-mono truncate">
                            {line}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video list */}
          <div className="glass p-6 rounded-xl">
            <div className="max-h-96 overflow-y-auto divide-y divide-border/40">
              {playlist.videos.map((v, i) => {
                const unlocked = isUnlocked(v.video_id);
                return (
                  <button
                    key={v.video_id}
                    onClick={() => unlocked && loadVideoIntoViewer(v.video_id)}
                    disabled={!unlocked}
                    className={`w-full text-left flex items-center py-2.5 gap-3 text-sm transition-colors ${
                      unlocked ? 'hover:bg-primary/5 cursor-pointer' : 'cursor-not-allowed'
                    } ${selectedId === v.video_id ? 'bg-primary/10' : ''}`}
                  >
                    <span className="w-8 text-right text-muted-foreground flex-shrink-0">{i + 1}.</span>
                    {unlocked
                      ? <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                      : <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    <span className={`flex-1 truncate ${unlocked ? '' : 'text-muted-foreground'}`}>
                      {v.title}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDuration(v.duration_seconds)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bulk-playlist progress popup (same overlay as single-video pages) */}
      <ProcessingOverlay
        isVisible={!!exporting || !!stopChoice}
        mode="playlist"
        progress={exporting}
        stopped={stopChoice ? { done: stopChoice.results.length, total: stopChoice.total } : null}
        onCancel={() => { cancelRef.current = true; }}
        onDownloadPartial={async () => {
          const choice = stopChoice;
          setStopChoice(null);
          if (choice) await packageResults(choice.results, choice.failures, choice.format);
        }}
        onDiscard={() => setStopChoice(null)}
        videoUrl={url}
      />

      {/* Single-video Word/PDF export popup (identical to the single-video tool) */}
      <ProcessingOverlay
        isVisible={!!exportingSingle}
        mode={exportingSingle || 'transcript'}
        videoUrl={currentVideo ? `https://youtu.be/${currentVideo.video_id}` : ''}
      />
    </div>
  );
};

export default PlaylistTool;
