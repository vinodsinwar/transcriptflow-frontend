import { useState } from 'react';
import { Sparkles, Copy } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

/**
 * AI summary of a single video (Pro). Uses the license key saved on the
 * playlist page (localStorage tf_license); links to /pricing without one.
 * Renders its own result card below the button row it's placed in.
 */
const SummarizeButton = ({ videoUrl }) => {
  const [licenseKey] = useState(() => {
    try { return localStorage.getItem('tf_license') || ''; } catch { return ''; }
  });
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!licenseKey) {
    return (
      <a href="/pricing" className="btn-secondary flex items-center space-x-2 text-sm" title="AI summaries are a Pro feature">
        <Sparkles className="w-4 h-4" />
        <span>AI Summary <span className="text-xs text-muted-foreground">(Pro)</span></span>
      </a>
    );
  }

  const run = async () => {
    if (state === 'loading' || !videoUrl) return;
    setState('loading');
    setError(null);
    try {
      const r = await fetch(`${BACKEND_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey, mode: 'video', video_url: videoUrl }),
      });
      const d = await r.json();
      if (d.summary) {
        setSummary(d);
        setState('done');
      } else {
        setError(d.error || 'Summary failed. Please try again.');
        setState('error');
      }
    } catch {
      setError('Summary failed. Please try again.');
      setState('error');
    }
  };

  return (
    <>
      <button onClick={run} disabled={state === 'loading'} className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50">
        {state === 'loading'
          ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          : <Sparkles className="w-4 h-4" />}
        <span>{state === 'loading' ? 'Summarizing…' : 'AI Summary'}</span>
      </button>

      {(summary || error) && (
        <div className="w-full mt-3">
          {error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          ) : (
            <div className="glass p-5 rounded-xl text-left">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Summary</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    {summary.summaries_used}/{summary.summaries_limit} this month
                  </span>
                  <button
                    onClick={async () => {
                      try { await navigator.clipboard.writeText(summary.summary); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* denied */ }
                    }}
                    className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />{copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{summary.summary}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SummarizeButton;
