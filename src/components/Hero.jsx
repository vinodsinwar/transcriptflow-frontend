import React, { useState } from 'react';
import { Play, Youtube, Clock, Shield, Users, Download, Copy, FileText } from 'lucide-react';

const Hero = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);

  const BACKEND_URL = 'https://5000-i714962ckr3pgp2k0087q-48e82c07.manusvm.computer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTranscript(null);
    
    try {
      console.log('Generating transcript for:', url);
      
      const response = await fetch(`${BACKEND_URL}/api/transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      // Backend returns success data directly, not wrapped in a success field
      if (data.transcript || data.cached) {
        console.log('Transcript received successfully:', data);
        setTranscript({
          success: true,
          transcript: data.transcript,
          video_title: data.video_title,
          duration: data.duration,
          language: data.language,
          word_count: data.word_count,
          srt: data.srt,
          cached: data.cached,
          processing_time_ms: data.processing_time_ms
        });
      } else {
        console.log('Backend returned error:', data.error);
        setError(data.error || 'Failed to generate transcript');
      }
    } catch (err) {
      console.error('Error generating transcript:', err);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleVideo = () => {
    setUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };

  const handleShortUrl = () => {
    setUrl('https://youtu.be/dQw4w9WgXcQ');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full gradient-bg opacity-20 blur-3xl float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full gradient-bg opacity-15 blur-3xl float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full gradient-bg opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
        {/* Main Heading */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Transform{' '}
            <span className="gradient-text">YouTube Videos</span>
            {' '}into{' '}
            <span className="gradient-text">Text</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate accurate transcripts from any YouTube video instantly.
          </p>
        </div>

        {/* Features Bar */}
        <div className="mb-12">
          <p className="text-lg text-muted-foreground mb-6">
            Free • No Signup Required • 125+ Languages • Professional Quality
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">2.3s Average</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">50,000+ Users</span>
            </div>
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
                  className="input-modern w-full pl-10 sm:pl-12 lg:pl-40 pr-3 sm:pr-4 py-3 sm:py-4 text-base sm:text-lg"
                  required
                />
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
          </div>
        )}

        {/* Transcript Display */}
        {transcript && transcript.success && (
          <div className="w-full max-w-4xl mx-auto mt-8 space-y-6">
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

            {/* Download Options */}
            <div className="glass p-4 rounded-xl">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => copyToClipboard(transcript.transcript)}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
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
              </div>
            </div>

            {/* Transcript Text */}
            <div className="glass p-6 rounded-xl">
              <h4 className="text-lg font-semibold mb-4">Transcript</h4>
              <div className="bg-background/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {transcript.transcript}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  // Helper functions
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadTranscript = (content, format) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
};

export default Hero;

