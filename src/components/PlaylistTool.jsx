import { useState } from 'react';
import JSZip from 'jszip';
import { Play, ListVideo, Lock, CheckCircle2, Download, KeyRound, Sparkles } from 'lucide-react';

const EXPORT_FORMATS = [
  { value: 'zip', label: 'ZIP — TXT + SRT per video' },
  { value: 'pdf', label: 'Combined PDF (one file)' },
  { value: 'docx', label: 'Combined Word (one file)' },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

// Set these to the live Dodo Payments checkout links to enable purchases.
const PRO_CHECKOUT_MONTHLY = '';
const PRO_CHECKOUT_YEARLY = '';
const PAYMENTS_LIVE = Boolean(PRO_CHECKOUT_MONTHLY || PRO_CHECKOUT_YEARLY);

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
  const [exporting, setExporting] = useState(null); // {done, total, currentTitle}
  const [exportFormat, setExportFormat] = useState('zip');

  const fetchPlaylist = async (playlistUrl, key) => {
    setLoading(true);
    setError(null);
    setPlaylist(null);
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

  const runExport = async () => {
    if (!playlist || exporting) return;
    const ids = playlist.unlocked_ids;
    const byId = Object.fromEntries(playlist.videos.map((v) => [v.video_id, v]));
    const results = []; // {video_id, title, transcript, srt, language, word_count}
    const failures = [];
    let quotaHit = false;
    setError(null);

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      setExporting({ done: i, total: ids.length, currentTitle: byId[id]?.title || id });
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

    if (results.length === 0) {
      if (!quotaHit) setError('None of these videos have transcripts available.');
      setExporting(null);
      return;
    }

    if (exportFormat === 'zip') {
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
      setExporting({ done: ids.length, total: ids.length, currentTitle: 'Packaging ZIP…' });
      const blob = await zip.generateAsync({ type: 'blob' });
      saveBlob(blob, `${slugify(playlist.title)}-transcripts.zip`);
    } else {
      // Combined PDF / Word: one formatting call, no extra YouTube fetches needed.
      setExporting({ done: ids.length, total: ids.length, currentTitle: `Building combined ${exportFormat.toUpperCase()}…` });
      try {
        const response = await fetch(`${BACKEND_URL}/api/playlist/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            format: exportFormat,
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
          saveBlob(await response.blob(), `${slugify(playlist.title)}-combined.${exportFormat}`);
        }
      } catch {
        setError('Combined export failed. Please try again.');
      }
    }
    setExporting(null);
  };

  const lockedCount = playlist ? playlist.video_count - playlist.unlocked_ids.length : 0;

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
            className="input-modern w-full pl-12 pr-4 py-4 text-lg"
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
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {playlist && (
        <div className="mt-8 space-y-6 text-left">
          {/* Playlist header */}
          <div className="glass p-6 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {playlist.video_count} videos
                  {playlist.licensed
                    ? ' — all unlocked with Pro ✨'
                    : ` — first ${playlist.free_limit} free, ${lockedCount} locked`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Export format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  disabled={!!exporting}
                  className="input-modern text-sm py-2 px-3 bg-background/80 disabled:opacity-50"
                >
                  {EXPORT_FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
                <button
                  onClick={runExport}
                  disabled={!!exporting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {playlist.licensed
                      ? `Download all ${playlist.unlocked_ids.length}`
                      : `Download ${playlist.unlocked_ids.length} free`}
                  </span>
                </button>
              </div>
            </div>
            {exporting && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="truncate pr-4">{exporting.currentTitle}</span>
                  <span>{exporting.done}/{exporting.total}</span>
                </div>
                <div className="h-2 bg-background/60 rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg transition-all duration-300"
                    style={{ width: `${Math.round((exporting.done / Math.max(exporting.total, 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
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
                        🚀 Pro launches in a few days — email support@transcriptflow.io for early access
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
                      {keyError && <p className="w-full text-xs text-red-400">{keyError}</p>}
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

          {/* Video list */}
          <div className="glass p-6 rounded-xl">
            <div className="max-h-96 overflow-y-auto divide-y divide-border/40">
              {playlist.videos.map((v, i) => {
                const unlocked = playlist.unlocked_ids.includes(v.video_id);
                return (
                  <div key={v.video_id} className="flex items-center py-2.5 gap-3 text-sm">
                    <span className="w-8 text-right text-muted-foreground flex-shrink-0">{i + 1}.</span>
                    {unlocked
                      ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      : <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                    <span className={`flex-1 truncate ${unlocked ? '' : 'text-muted-foreground'}`}>
                      {v.title}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDuration(v.duration_seconds)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistTool;
