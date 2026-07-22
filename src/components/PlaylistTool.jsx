import { useState, useRef, useEffect } from 'react';
import { Play, ListVideo, Lock, CheckCircle2, Download, Copy, KeyRound, Sparkles, FileText, FileType, FileArchive } from 'lucide-react';
import ProcessingOverlay from './ProcessingOverlay';
import TranscriptViewer from './TranscriptViewer';
import { plainText, aiPrompt } from '../lib/transcriptText';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

// Set these to the live Dodo Payments checkout links to enable purchases.
const PRO_CHECKOUT_MONTHLY = '';
const PRO_CHECKOUT_YEARLY = '';
const PAYMENTS_LIVE = Boolean(PRO_CHECKOUT_MONTHLY || PRO_CHECKOUT_YEARLY);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
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

  const runExport = async (format) => {
    if (!playlist || exporting) return;
    cancelRef.current = false;
    const ids = playlist.unlocked_ids;
    const byId = Object.fromEntries(playlist.videos.map((v) => [v.video_id, v]));
    const results = []; // {video_id, title, transcript, srt, language, word_count}
    const failures = [];
    let quotaHit = false;
    setError(null);

    for (let i = 0; i < ids.length; i++) {
      if (cancelRef.current) break;
      const id = ids[i];
      setExporting({ done: i, total: ids.length, currentTitle: byId[id]?.title || id });
      // Reuse anything already fetched into the viewer to save requests/quota.
      const cached = videoCacheRef.current.get(id);
      if (cached && cached.transcript) {
        results.push({
          video_id: id,
          title: cached.video_title || byId[id]?.title || id,
          transcript: cached.transcript,
          srt: cached.srt,
          language: cached.language,
          word_count: cached.word_count,
        });
        continue;
      }
      try {
        const endpoint = playlist.licensed ? '/api/playlist/transcript' : '/api/transcript';
        const body = { video_url: `https://youtu.be/${id}` };
        if (playlist.licensed) body.license_key = licenseKey;
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
        results.push({
          video_id: id,
          title: data.video_title || byId[id]?.title || id,
          transcript: data.transcript,
          srt: data.srt,
          language: data.language,
          word_count: data.word_count,
        });
      } catch {
        failures.push(byId[id]?.title || id);
      }
    }

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

  const lockedCount = playlist ? playlist.video_count - playlist.unlocked_ids.length : 0;
  const isUnlocked = (id) => playlist?.unlocked_ids.includes(id);

  const bulkButtons = [
    { fmt: 'zip', label: 'ZIP (TXT + SRT)', Icon: FileArchive },
    { fmt: 'txt', label: 'Combined TXT', Icon: FileText },
    { fmt: 'pdf', label: 'Combined PDF', Icon: FileType },
    { fmt: 'docx', label: 'Combined Word', Icon: FileType },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <ListVideo className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube playlist URL (contains list=...)"
            className="input-modern w-full py-4 text-lg"
            style={{ paddingLeft: '3rem', paddingRight: '1rem' }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
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
              <span>Load Playlist</span>
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
                    Export up to 1,000 videos per month — as a ZIP of TXT + SRT files, or one combined PDF/Word document.
                    <span className="text-foreground font-medium"> $4.99/month</span> or
                    <span className="text-foreground font-medium"> $29/year</span>.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {PAYMENTS_LIVE ? (
                      <>
                        {PRO_CHECKOUT_MONTHLY && (
                          <a href={PRO_CHECKOUT_MONTHLY} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                            Get Pro — $4.99/mo
                          </a>
                        )}
                        {PRO_CHECKOUT_YEARLY && (
                          <a href={PRO_CHECKOUT_YEARLY} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                            $29/year (save 51%)
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

          {/* Quota display for licensed users */}
          {playlist.licensed && (
            <p className="text-xs text-muted-foreground text-center">
              Pro license active — quota: 200 videos/day, 1,000 videos/month.{' '}
              <a href="https://customer.dodopayments.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Manage subscription & billing
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
            <p className="text-xs text-muted-foreground mt-3">
              Very long playlists in non-Latin languages can produce large PDFs — Combined Word or TXT stays small.
            </p>
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
