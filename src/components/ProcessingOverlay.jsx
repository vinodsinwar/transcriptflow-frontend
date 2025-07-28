import React, { useEffect, useState } from 'react';
import { Loader2, Youtube, Clock } from 'lucide-react';

const ProcessingOverlay = ({ isVisible, onClose, videoUrl }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isVisible) {
      // Track processing overlay shown
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'processing_overlay_shown',
          video_url: videoUrl,
          timestamp: new Date().toISOString()
        });
      }

      // Start processing timer
      timer = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);

      // Load AdSense ad after a short delay
      setTimeout(() => {
        if (window.adsbygoogle && !adLoaded) {
          try {
            window.adsbygoogle.push({});
            setAdLoaded(true);
            
            // Track ad impression
            if (typeof dataLayer !== 'undefined') {
              dataLayer.push({
                event: 'adsense_impression',
                ad_unit: 'processing_overlay',
                placement: 'transcript_generation',
                user_action: 'generate_transcript'
              });
            }
          } catch (error) {
            console.log('AdSense loading error:', error);
          }
        }
      }, 500);
    } else {
      // Reset when overlay closes
      setProcessingTime(0);
      setAdLoaded(false);
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisible, videoUrl, adLoaded]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Youtube className="w-6 h-6" />
            <h3 className="text-xl font-bold">TranscriptFlow</h3>
          </div>
          <p className="text-blue-100">Generating your transcript...</p>
        </div>

        {/* Processing Content */}
        <div className="p-6 text-center">
          {/* Loading Animation */}
          <div className="mb-6">
            <div className="relative mx-auto w-16 h-16 mb-4">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Processing Video
            </h4>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <Clock className="w-4 h-4" />
              <span>{processingTime}s elapsed</span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>• Extracting audio content</p>
              <p>• Analyzing speech patterns</p>
              <p>• Generating accurate transcript</p>
            </div>
          </div>

          {/* AdSense Ad Container */}
          <div className="ad-container mb-4">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Advertisement</div>
            
            {/* AdSense Ad Unit */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1068219746155994" crossOrigin="anonymous"></script>
              <ins 
                className="adsbygoogle"
                style={{
                  display: 'block',
                  minHeight: '200px',
                  width: '100%'
                }}
                data-ad-client="ca-pub-1068219746155994"
                data-ad-slot="processing-overlay"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              
              {/* Fallback content while ad loads */}
              {!adLoaded && (
                <div className="flex items-center justify-center h-48 text-gray-400">
                  <div className="text-center">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-32 w-full rounded mb-2"></div>
                    <p className="text-xs">Loading advertisement...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Processing Tips */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <p className="font-medium mb-1">💡 Pro Tip:</p>
            <p>Longer videos may take up to 10 seconds to process. We're ensuring maximum accuracy!</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 Secure Processing</span>
            <span>•</span>
            <span>🚀 AI-Powered</span>
            <span>•</span>
            <span>🌍 125+ Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;

