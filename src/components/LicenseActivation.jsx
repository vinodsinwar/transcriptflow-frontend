import { useState, useEffect } from 'react';
import { KeyRound, CheckCircle2, X } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

/**
 * License key activation & status. The single source of truth is
 * localStorage 'tf_license' — the same key PlaylistTool and SummarizeButton
 * read, so activating here unlocks every Pro surface instantly.
 */
const LicenseActivation = ({ compact = false }) => {
  const [savedKey, setSavedKey] = useState(() => {
    try { return localStorage.getItem('tf_license') || ''; } catch { return ''; }
  });
  const [status, setStatus] = useState(null);   // {valid, plan, credits_remaining}
  const [input, setInput] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const checkKey = async (key) => {
    const r = await fetch(`${BACKEND_URL}/api/license/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ license_key: key }),
    });
    return r.json();
  };

  // Verify any saved key on mount so the status is always live.
  useEffect(() => {
    if (!savedKey) return;
    checkKey(savedKey).then((d) => setStatus(d)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activate = async () => {
    const key = input.trim();
    if (!key || checking) return;
    setChecking(true);
    setError(null);
    try {
      const d = await checkKey(key);
      if (d.valid) {
        try { localStorage.setItem('tf_license', key); } catch { /* private mode */ }
        setSavedKey(key);
        setStatus(d);
        setInput('');
      } else {
        setError('That key doesn’t look active. Double-check the purchase email, or retrieve your key from the customer portal.');
      }
    } catch {
      setError('Couldn’t reach the server — please try again in a moment.');
    } finally {
      setChecking(false);
    }
  };

  const removeKey = () => {
    try { localStorage.removeItem('tf_license'); } catch { /* ok */ }
    setSavedKey('');
    setStatus(null);
  };

  // ---- Active state ----
  if (savedKey && status?.valid) {
    return (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${compact ? '' : 'justify-center'}`}>
        <span className="flex items-center gap-1.5 text-sm font-medium text-green-700">
          <CheckCircle2 className="w-4 h-4" />
          {status.plan === 'pack'
            ? <>Course Pack active — {status.credits_remaining} credits left</>
            : <>Pro active on this browser</>}
        </span>
        <button onClick={removeKey} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1" title="Remove the key from this browser (e.g. on a shared computer)">
          <X className="w-3 h-3" /> Remove key
        </button>
      </div>
    );
  }

  // ---- Entry state ----
  return (
    <div className={compact ? '' : 'max-w-md mx-auto'}>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <KeyRound className="w-4 h-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') activate(); }}
            placeholder="Paste your license key…"
            className="input-modern w-full py-2.5 text-sm"
            style={{ paddingLeft: '2.25rem', paddingRight: '0.75rem' }}
          />
        </div>
        <button onClick={activate} disabled={checking || !input.trim()} className="btn-primary text-sm py-2.5 disabled:opacity-50">
          {checking ? 'Checking…' : 'Activate'}
        </button>
      </div>
      {savedKey && status && !status.valid && !error && (
        <p className="text-xs text-red-700 mt-2">
          The key saved on this browser is no longer active — it may have expired or been cancelled.{' '}
          <a href="https://customer.dodopayments.com" target="_blank" rel="noopener noreferrer" className="underline">Check the customer portal</a>.
        </p>
      )}
      {error && (
        <p className="text-xs text-red-700 mt-2">
          {error}{' '}
          <a href="https://customer.dodopayments.com" target="_blank" rel="noopener noreferrer" className="underline">Customer portal →</a>
        </p>
      )}
      {!compact && !error && (
        <p className="text-xs text-muted-foreground mt-2">
          Your key arrives by email right after purchase. One paste — this browser remembers it.
        </p>
      )}
    </div>
  );
};

export default LicenseActivation;
