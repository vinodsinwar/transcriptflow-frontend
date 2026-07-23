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

const csvEscape = (s) => `"${String(s).replace(/"/g, '""')}"`;

/** CSV of raw segments: start,duration,text — for spreadsheets and data work. */
export const toCSV = (segments) =>
  'start,duration,text\n' +
  (segments || []).map((s) => `${s.start},${s.duration},${csvEscape(s.text)}`).join('\n');

/** Structured JSON export of the whole transcript payload. */
export const toJSONExport = (payload) =>
  JSON.stringify(
    {
      video_id: payload.video_id,
      video_title: payload.video_title,
      language: payload.language,
      word_count: payload.word_count,
      duration: payload.duration,
      segments: payload.segments || [],
    },
    null,
    2
  );

/** Markdown (Obsidian/Notion-friendly): title, meta line, bold timestamps. */
export const toMarkdown = (payload) => {
  const title = payload.video_title || 'YouTube Video Transcript';
  const lines = (payload.transcript || '')
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\[\d+:\d{2}\])\s?(.*)$/);
      return m ? `**${m[1]}** ${m[2]}` : line;
    })
    .join('\n\n');
  return (
    `# ${title}\n\n` +
    `> Language: ${payload.language || '?'} · Words: ${payload.word_count ?? '?'} · ` +
    `Source: https://youtu.be/${payload.video_id}\n\n${lines}\n`
  );
};
