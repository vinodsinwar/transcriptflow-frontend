import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const ResultBanner = ({ isVisible, transcript }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isVisible && transcript) {
      // Show banner after transcript is loaded
      setTimeout(() => {
        setShowBanner(true);
        
        // Track banner ad impression
        if (typeof dataLayer !== 'undefined') {
          dataLayer.push({
            event: 'adsense_impression',
            ad_unit: 'result_banner',
            placement: 'transcript_results',
            video_title: transcript.video_title,
            word_count: transcript.word_count
          });
        }

        // Load AdSense ad
        if (window.adsbygoogle && !adLoaded) {
          try {
            window.adsbygoogle.push({});
            setAdLoaded(true);
          } catch (error) {
            console.log('AdSense banner loading error:', error);
          }
        }
      }, 1000);
    } else {
      setShowBanner(false);
      setAdLoaded(false);
    }
  }, [isVisible, transcript, adLoaded]);

  const handleClose = () => {
    setShowBanner(false);
    
    // Track banner dismissal
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'ad_banner_dismissed',
        ad_unit: 'result_banner',
        placement: 'transcript_results'
      });
    }
  };

  if (!showBanner || !isVisible) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          aria-label="Close advertisement"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Ad Content */}
        <div className="p-4">
          {/* Ad Label */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 text-center uppercase tracking-wide">
            Advertisement
          </div>

          {/* AdSense Banner Ad */}
          <div className="flex justify-center">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1068219746155994" crossOrigin="anonymous"></script>
            <ins 
              className="adsbygoogle"
              style={{
                display: 'block',
                width: '100%',
                minHeight: '120px',
                maxWidth: '728px'
              }}
              data-ad-client="ca-pub-1068219746155994"
              data-ad-slot="result-banner"
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            ></ins>
            
            {/* Fallback content while ad loads */}
            {!adLoaded && (
              <div className="flex items-center justify-center h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center text-gray-400">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-20 w-full max-w-md rounded mb-2"></div>
                  <p className="text-xs">Loading advertisement...</p>
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🎉 <span className="font-medium">Transcript generated successfully!</span> 
              {transcript?.word_count && ` ${transcript.word_count} words processed.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultBanner;

