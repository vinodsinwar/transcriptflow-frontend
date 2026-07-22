import React, { useState, useEffect, useRef } from 'react';
import { Play, Youtube, Globe, ListVideo, Download, Copy, FileText, ClipboardPaste, RotateCcw, History, Sparkles } from 'lucide-react';
import { plainText, aiPrompt } from '../lib/transcriptText';
import ProcessingOverlay from './ProcessingOverlay';
import ResultBanner from './ResultBanner';
import TranscriptViewer from './TranscriptViewer';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false);
  const [languages, setLanguages] = useState(null);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedAI, setCopiedAI] = useState(false);
  const [withTimestamps, setWithTimestamps] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [exporting, setExporting] = useState(null);
  const [statsCount, setStatsCount] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUrl, setLastUrl] = useState('');
  const resultRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/stats`)
      .then((r) => r.json())
      .then((d) => { if (d.transcripts_total > 0) setStatsCount(d.transcripts_total); })
      .catch(() => {});
    try {
      setHistory(JSON.parse(localStorage.getItem('tf_history') || '[]'));
    } catch { /* private mode */ }
  }, []);

  const rememberTranscript = (data) => {
    try {
      const entry = {
        video_id: data.video_id,
        title: data.video_title || data.video_id,
        language: data.language,
        ts: Date.now(),
      };
      const next = [entry, ...history.filter((h) => h.video_id !== entry.video_id)].slice(0, 10);
      setHistory(next);
      localStorage.setItem('tf_history', JSON.stringify(next));
    } catch { /* private mode */ }
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
    
    // Show processing overlay with ads
    setShowProcessingOverlay(true);
    
    // Track transcript generation start
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'transcript_generation_started',
        video_url: targetUrl,
        timestamp: new Date().toISOString(),
        user_action: 'generate_transcript_clicked'
      });
    }
    
    try {
      
      
      const response = await fetch(`${BACKEND_URL}/api/transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      // Backend returns success data directly, not wrapped in a success field
      if (data.transcript || data.cached) {
        setTranscript({ ...data, success: true });
        rememberTranscript(data);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 1200);

        // Track successful transcript generation
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            event: 'transcript_generated',
            video_url: targetUrl,
            video_title: data.video_title,
            language: data.language,
            word_count: data.word_count,
            processing_time_ms: data.processing_time_ms,
            cached: data.cached,
            success: true
          });
        }
      } else {
        console.log('Backend returned error:', data.error);
        setError(data.error_type === 'rate_limited'
          ? 'You’re going fast — please wait about 30 seconds and try again.'
          : (data.error || 'Failed to generate transcript'));
        
        // Track transcript generation error
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            event: 'transcript_generation_error',
            video_url: targetUrl,
            error_message: data.error || 'Failed to generate transcript',
            success: false
          });
        }
      }
    } catch (err) {
      console.error('Error generating transcript:', err);
      setError('Failed to connect to server. Please try again.');
      
      // Track connection error
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'transcript_generation_error',
          video_url: targetUrl,
          error_message: 'Failed to connect to server',
          error_type: 'connection_error',
          success: false
        });
      }
    } finally {
      setIsLoading(false);
      setShowProcessingOverlay(false);
    }
  };

  const handleSampleVideo = () => {
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };

  const handleShortUrl = () => {
    setUrl('https://youtu.be/dQw4w9WgXcQ');
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

  const downloadFilename = (format) => {
    const title = transcript?.video_title;
    const base = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
      : (transcript?.video_id || 'transcript');
    return `${base || 'transcript'}.${format}`;
  };

  const downloadTranscript = (content, format) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = downloadFilename(format);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
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
    } catch (err) {
      console.error('Failed to load languages:', err);
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
      const body = { video_url: `https://youtu.be/${transcript.video_id}` };
      if (languageCode) body.target_language = languageCode;
      const response = await fetch(`${BACKEND_URL}/api/transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.transcript) {
        setTranscript((prev) => ({ ...prev, ...data, success: true }));
        setCurrentLanguage(languageCode);
      } else {
        setError(data.error || 'Translation failed. Please try another language.');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Failed to translate. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Server-generated file downloads (Word / PDF)
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
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = downloadFilename(format);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Export error:', err);
      setError('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full gradient-bg opacity-20 blur-3xl float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full gradient-bg opacity-15 blur-3xl float" style={{ animationDelay: '-3s' }}></div>
        <div className="transcript-motif" aria-hidden="true">
          {[92, 68, 84, 52, 76, 60, 88, 44].map((w, i) => (
            <div key={i} className="transcript-motif-line" style={{ width: `${w}%`, animationDelay: `${i * 0.35}s` }}></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {/* Main Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Free <span className="gradient-text">YouTube Transcript Generator</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Every word of any YouTube video — as text, subtitles, or translations.
            Timestamped transcripts in seconds; export TXT, SRT, VTT, PDF, or Word — even whole playlists.
          </p>
        </div>

        {/* Features Bar */}
        <div className="mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Free • No Signup Required • 125+ Languages • Professional Quality
          </p>
          
          {/* Honest capability chips */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">TXT · SRT · VTT · PDF · Word</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Globe className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">125+ languages</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <ListVideo className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Whole playlists (Pro)</span>
            </div>
            {statsCount && (
              <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
                <Play className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{statsCount.toLocaleString()} transcripts generated</span>
              </div>
            )}
          </div>
        </div>

        {/* Input Form */}
        <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* URL Input */}
            <div className="relative">
              <label htmlFor="youtube-url" className="block text-left text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
                YouTube Video URL
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">YouTube Video URL</span>
                </div>
                <input
                  id="youtube-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste any YouTube URL here..."
                  className="input-modern w-full pl-10 sm:pl-12 lg:pl-40 pr-20 py-3 sm:py-4 text-base sm:text-lg"
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
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="btn-primary w-full py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                  <span>Generating Transcript...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Generate Transcript</span>
                </>
              )}
            </button>
          </form>

          {/* Sample URLs */}
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground">Try with:</span>
            <button
              onClick={handleSampleVideo}
              className="btn-secondary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
            >
              Sample Video
            </button>
            <button
              onClick={handleShortUrl}
              className="btn-secondary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4"
            >
              Short URL
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-5 text-left max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground flex items-center space-x-1">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent — stored only in your browser</span>
                </p>
                <button
                  onClick={() => { setHistory([]); try { localStorage.removeItem('tf_history'); } catch { /* ok */ } }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 6).map((h) => (
                  <button
                    key={h.video_id}
                    onClick={() => setUrl(`https://youtu.be/${h.video_id}`)}
                    className="glass px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors max-w-[220px] truncate"
                    title={h.title}
                  >
                    {h.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Preview */}
        <div className="text-center mt-4 sm:mt-0">
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
            Explore powerful features below
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="text-muted-foreground">125+ Languages</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Multiple Formats</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Privacy First</span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full max-w-4xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
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

        {/* Transcript Display */}
        {transcript && transcript.success && (
          <div ref={resultRef} className="w-full max-w-4xl mx-auto mt-8 space-y-6 scroll-mt-24">
            {/* Result Banner Ad */}
            <ResultBanner 
              isVisible={true}
              transcript={transcript}
            />

            {/* Video Info */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{transcript.video_title || 'YouTube Video Transcript'}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Duration: {transcript.duration || 'N/A'}</span>
                    <span>Language: {transcript.language || 'Auto-detected'}</span>
                    <span>Words: {transcript.word_count || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download & Translate Options */}
            <div className="glass p-4 rounded-xl">
              <div className="flex flex-wrap gap-3 justify-center items-center">
                <div className="flex items-center rounded-lg overflow-hidden border border-border/60">
                  <button
                    onClick={() => copyToClipboard(withTimestamps ? transcript.transcript : plainText(transcript.transcript))}
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
                      await navigator.clipboard.writeText(aiPrompt(transcript.transcript, transcript.video_title));
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
                <button
                  onClick={() => downloadTranscript(transcript.transcript, 'txt')}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download TXT</span>
                </button>
                {transcript.srt && (
                  <button
                    onClick={() => downloadTranscript(transcript.srt, 'srt')}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download SRT</span>
                  </button>
                )}
                {transcript.vtt && (
                  <button
                    onClick={() => downloadTranscript(transcript.vtt, 'vtt')}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download VTT</span>
                  </button>
                )}
                <button
                  onClick={() => exportFile('docx')}
                  disabled={!!exporting}
                  className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50"
                >
                  {exporting === 'docx'
                    ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    : <Download className="w-4 h-4" />}
                  <span>{exporting === 'docx' ? 'Preparing…' : 'Download Word'}</span>
                </button>
                <button
                  onClick={() => exportFile('pdf')}
                  disabled={!!exporting}
                  className="btn-secondary flex items-center space-x-2 text-sm disabled:opacity-50"
                >
                  {exporting === 'pdf'
                    ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    : <Download className="w-4 h-4" />}
                  <span>{exporting === 'pdf' ? 'Preparing…' : 'Download PDF'}</span>
                </button>
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
                    {isTranslating
                      ? 'Translating…'
                      : languagesLoading
                        ? 'Loading languages…'
                        : '🌐 Translate to…'}
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
              </div>
            </div>

            {/* Contextual Pro hint */}
            <p className="text-center text-sm text-muted-foreground">
              Working through a whole playlist?{' '}
              <a href="/youtube-playlist-transcript" className="text-primary hover:underline">
                Pro exports up to 100 videos at once →
              </a>
            </p>

            {/* Transcript reading view */}
            <TranscriptViewer transcript={transcript.transcript} videoId={transcript.video_id} />
          </div>
        )}
        {/* Footer with Legal Links */}
        <div className="w-full max-w-4xl mx-auto mt-16 pt-8 border-t border-border/20">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
            <a 
              href="/privacy-policy" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <a 
              href="/terms-of-service" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <span className="hidden sm:inline">•</span>
            <span>© 2025 TranscriptFlow. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* Processing Overlay with AdSense Ads */}
      <ProcessingOverlay 
        isVisible={showProcessingOverlay || !!exporting}
        mode={exporting || 'transcript'}
        onClose={() => setShowProcessingOverlay(false)}
        videoUrl={url}
      />
    </section>
  );
};

export default Hero;

