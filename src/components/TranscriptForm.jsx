import { useState, useRef } from 'react';
import { Play, Youtube, Download, Copy, FileText, ClipboardPaste, RotateCcw } from 'lucide-react';
import TranscriptViewer from './TranscriptViewer';
import ProcessingOverlay from './ProcessingOverlay';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

/**
 * Compact, reusable transcript tool used by the tool landing pages.
 * mode: 'translate' shows the language selector prominently;
 *       'download' emphasizes the export buttons.
 */
const TranscriptForm = ({ mode = 'download' }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [lastUrl, setLastUrl] = useState('');
  const resultRef = useRef(null);

  const requestTranscript = async (videoUrl, targetLanguage) => {
    const body = { video_url: videoUrl };
    if (targetLanguage) body.target_language = targetLanguage;
    const response = await fetch(`${BACKEND_URL}/api/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const handleSubmit = async (e, overrideUrl) => {
    e.preventDefault();
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) return;
    setIsLoading(true);
    setError(null);
    setTranscript(null);
    setLanguages(null);
    setCurrentLanguage(null);
    setLastUrl(targetUrl);
    try {
      const data = await requestTranscript(targetUrl);
      if (data.transcript) {
        setTranscript({ ...data, success: true });
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 1200);
      } else {
        setError(data.error || 'Failed to generate transcript');
      }
    } catch {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadLanguages = async () => {
    if (languages || languagesLoading || !transcript) return;
    setLanguagesLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/languages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: `https://youtu.be/${transcript.video_id}` }),
      });
      const data = await response.json();
      setLanguages(data.translation_languages || []);
    } catch {
      setLanguages([]);
    } finally {
      setLanguagesLoading(false);
    }
  };

  const handleTranslate = async (languageCode) => {
    if (!transcript || isTranslating) return;
    setIsTranslating(true);
    setError(null);
    try {
      const data = await requestTranscript(`https://youtu.be/${transcript.video_id}`, languageCode);
      if (data.transcript) {
        setTranscript((prev) => ({ ...prev, ...data, success: true }));
        setCurrentLanguage(languageCode);
      } else {
        setError(data.error || 'Translation failed. Please try another language.');
      }
    } catch {
      setError('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadName = (format) => {
    const title = transcript?.video_title;
    const base = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
      : (transcript?.video_id || 'transcript');
    return `${base || 'transcript'}.${format}`;
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

  const downloadTranscript = (content, format) => {
    saveBlob(new Blob([content], { type: 'text/plain' }), downloadName(format));
  };

  const exportFile = async (format) => {
    if (!transcript || exporting) return;
    setExporting(format);
    try {
      const body = { video_url: `https://youtu.be/${transcript.video_id}`, format };
      if (currentLanguage) body.target_language = currentLanguage;
      const response = await fetch(`${BACKEND_URL}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Export failed. Please try again.');
        return;
      }
      saveBlob(await response.blob(), downloadName(format));
    } catch {
      setError('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const translateSelect = (
    <select
      aria-label="Translate transcript"
      className="input-modern text-sm py-2 px-3 max-w-[220px] bg-background/80"
      disabled={isTranslating}
      onFocus={loadLanguages}
      onMouseDown={loadLanguages}
      value=""
      onChange={(e) => {
        if (e.target.value === '__original__') handleTranslate(null);
        else if (e.target.value) handleTranslate(e.target.value);
      }}
    >
      <option value="" disabled>
        {isTranslating ? 'Translating…' : languagesLoading ? 'Loading languages…' : '🌐 Translate to…'}
      </option>
      <option value="__original__">Original language</option>
      {(languages || []).map((l) => (
        <option key={l.language_code} value={l.language_code}>
          {l.language}
        </option>
      ))}
      {languages !== null && languages.length === 0 && (
        <option value="" disabled>No translations available for this video</option>
      )}
    </select>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Youtube className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste any YouTube URL here..."
            className="input-modern w-full pl-12 pr-20 py-4 text-lg"
            required
          />
          {typeof navigator !== 'undefined' && navigator.clipboard?.readText && (
            <button
              type="button"
              onClick={async () => {
                try { setUrl((await navigator.clipboard.readText()).trim()); } catch { /* denied */ }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Paste</span>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Fetching transcript…</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>{mode === 'translate' ? 'Get & Translate Transcript' : 'Get Transcript'}</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
          {lastUrl && (
            <button
              onClick={() => { setUrl(lastUrl); handleSubmit({ preventDefault: () => {} }, lastUrl); }}
              className="btn-secondary text-sm mt-3 flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try again</span>
            </button>
          )}
        </div>
      )}

      {transcript && transcript.success && (
        <div ref={resultRef} className="mt-8 space-y-6 text-left scroll-mt-24">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-start space-x-4">
              <FileText className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">{transcript.video_title || 'YouTube Video Transcript'}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>Language: {transcript.language}</span>
                  <span>Words: {transcript.word_count}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-xl">
            <div className="flex flex-wrap gap-3 justify-center items-center">
              {mode === 'translate' && translateSelect}
              <button onClick={() => copyToClipboard(transcript.transcript)} className="btn-secondary flex items-center space-x-2 text-sm">
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
              <button onClick={() => downloadTranscript(transcript.transcript, 'txt')} className="btn-secondary flex items-center space-x-2 text-sm">
                <Download className="w-4 h-4" />
                <span>TXT</span>
              </button>
              {transcript.srt && (
                <button onClick={() => downloadTranscript(transcript.srt, 'srt')} className="btn-secondary flex items-center space-x-2 text-sm">
                  <Download className="w-4 h-4" />
                  <span>SRT</span>
                </button>
              )}
              {transcript.vtt && (
                <button onClick={() => downloadTranscript(transcript.vtt, 'vtt')} className="btn-secondary flex items-center space-x-2 text-sm">
                  <Download className="w-4 h-4" />
                  <span>VTT</span>
                </button>
              )}
              <button onClick={() => exportFile('docx')} disabled={!!exporting} className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50">
                {exporting === 'docx'
                  ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  : <Download className="w-4 h-4" />}
                <span>{exporting === 'docx' ? 'Preparing…' : 'Word'}</span>
              </button>
              <button onClick={() => exportFile('pdf')} disabled={!!exporting} className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50">
                {exporting === 'pdf'
                  ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                  : <Download className="w-4 h-4" />}
                <span>{exporting === 'pdf' ? 'Preparing…' : 'PDF'}</span>
              </button>
              {mode !== 'translate' && translateSelect}
            </div>
          </div>

          <TranscriptViewer transcript={transcript.transcript} videoId={transcript.video_id} />
        </div>
      )}

      <ProcessingOverlay
        isVisible={!!exporting}
        mode={exporting || 'transcript'}
        videoUrl={transcript ? `https://youtu.be/${transcript.video_id}` : ''}
      />
    </div>
  );
};

export default TranscriptForm;
