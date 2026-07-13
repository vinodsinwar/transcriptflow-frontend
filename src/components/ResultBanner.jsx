const ResultBanner = ({ isVisible, transcript }) => {
  if (!isVisible || !transcript) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
        <p className="text-sm text-green-400">
          🎉 <span className="font-medium">Transcript generated successfully!</span>
          {transcript?.word_count ? ` ${transcript.word_count} words processed.` : ''}
        </p>
      </div>
    </div>
  );
};

export default ResultBanner;
