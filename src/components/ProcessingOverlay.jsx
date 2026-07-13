import { useEffect, useState } from 'react';
import { Loader2, Youtube, Clock } from 'lucide-react';

const ProcessingOverlay = ({ isVisible, videoUrl }) => {
  const [processingTime, setProcessingTime] = useState(0);

  useEffect(() => {
    let timer;
    if (isVisible) {
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'processing_overlay_shown',
          video_url: videoUrl,
          timestamp: new Date().toISOString()
        });
      }

      timer = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    } else {
      setProcessingTime(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisible, videoUrl]);

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
            <p>• Fetching available captions</p>
            <p>• Building timestamped transcript</p>
            <p>• Preparing TXT and SRT downloads</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 Secure Processing</span>
            <span>•</span>
            <span>🌍 125+ Languages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingOverlay;
