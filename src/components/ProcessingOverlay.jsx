import { useEffect, useState } from 'react';
import { Loader2, Youtube, Clock } from 'lucide-react';

const ProcessingOverlay = ({
  isVisible,
  videoUrl,
  mode = 'transcript',
  progress = null,      // playlist mode: {done, total, currentTitle}
  stopped = null,       // playlist mode, after Stop: {done, total}
  onCancel,             // playlist mode: shows "Stop export" while fetching
  onDownloadPartial,    // playlist mode, stopped: download what's fetched
  onDiscard,            // playlist mode, stopped: discard and close
}) => {
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
          <p className="text-blue-100">
            {mode === 'playlist'
              ? (stopped ? 'Export stopped' : 'Exporting your playlist...')
              : mode === 'transcript' ? 'Generating your transcript...' : `Preparing your ${mode.toUpperCase()} file...`}
          </p>
        </div>

        {/* Processing Content */}
        {mode === 'playlist' ? (
          <div className="p-6 text-center">
            {stopped ? (
              <>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Stopped at {stopped.done} of {stopped.total} videos
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                  {stopped.done > 0
                    ? 'You can download the transcripts fetched so far, or discard them.'
                    : 'Nothing was fetched yet.'}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {stopped.done > 0 && onDownloadPartial && (
                    <button
                      onClick={onDownloadPartial}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Download {stopped.done} video{stopped.done === 1 ? '' : 's'}
                    </button>
                  )}
                  {onDiscard && (
                    <button
                      onClick={onDiscard}
                      className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Discard
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative mx-auto w-16 h-16 mb-4">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {progress && progress.done >= progress.total ? 'Packaging your download' : 'Fetching transcripts'}
                </h4>

                {progress && (
                  <>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round((progress.done / Math.max(progress.total, 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {Math.min(progress.done, progress.total)} of {progress.total} videos
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-3" title={progress.currentTitle}>
                      {progress.currentTitle}
                    </p>
                  </>
                )}

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{processingTime}s elapsed</span>
                </div>

                {onCancel && progress && progress.done < progress.total && (
                  <button
                    onClick={onCancel}
                    className="text-sm font-medium px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Stop export
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
        <div className="p-6 text-center">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>

          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {mode === 'transcript' ? 'Processing Video' : `Creating ${mode === 'docx' ? 'Word document' : 'PDF document'}`}
          </h4>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Clock className="w-4 h-4" />
            <span>{processingTime}s elapsed</span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {mode === 'transcript' ? (
              <>
                <p>• Fetching available captions</p>
                <p>• Building timestamped transcript</p>
                <p>• Preparing TXT and SRT downloads</p>
              </>
            ) : (
              <>
                <p>• Formatting the transcript</p>
                <p>• Laying out pages and timestamps</p>
                <p>• Your download starts automatically</p>
              </>
            )}
          </div>
        </div>
        )}

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
