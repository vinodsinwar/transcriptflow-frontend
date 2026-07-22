// Helpers for turning a timestamped transcript into other text shapes.

const TS_PREFIX = /^\[\d+:\d{2}\]\s?/;

/** Strip the leading [MM:SS] timestamp from every line. */
export const stripTimestamps = (transcript) =>
  (transcript || '')
    .split('\n')
    .map((line) => line.replace(TS_PREFIX, ''))
    .join('\n');

/** Plain prose version (no timestamps), for docs and AI tools. */
export const plainText = (transcript) => stripTimestamps(transcript).trim();

/** Transcript wrapped in a ready-to-paste AI prompt. */
export const aiPrompt = (transcript, videoTitle) => {
  const title = videoTitle ? `"${videoTitle}"` : 'this YouTube video';
  return (
    `Below is the transcript of ${title}. ` +
    `Please summarize the key points, then list any actionable takeaways.\n\n` +
    `--- TRANSCRIPT ---\n\n${plainText(transcript)}`
  );
};
