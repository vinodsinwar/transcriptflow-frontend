import { toCSV, toJSONExport, toMarkdown } from '../lib/transcriptText';

const saveText = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
};

/**
 * Compact "More formats" dropdown: CSV / JSON / Markdown downloads built
 * client-side from the transcript payload (which includes raw segments).
 */
const ExtraFormats = ({ payload, baseName }) => {
  if (!payload) return null;
  const base = baseName || (payload.video_title || payload.video_id || 'transcript')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

  const handle = (fmt) => {
    if (fmt === 'csv') saveText(toCSV(payload.segments), `${base}.csv`, 'text/csv');
    else if (fmt === 'json') saveText(toJSONExport(payload), `${base}.json`, 'application/json');
    else if (fmt === 'md') saveText(toMarkdown(payload), `${base}.md`, 'text/markdown');
  };

  return (
    <select
      aria-label="More download formats"
      className="input-modern text-sm py-2 px-3 max-w-[180px]"
      value=""
      onChange={(e) => { if (e.target.value) { handle(e.target.value); e.target.value = ''; } }}
    >
      <option value="" disabled>More formats…</option>
      <option value="md">Markdown (.md)</option>
      <option value="csv">CSV (.csv)</option>
      <option value="json">JSON (.json)</option>
    </select>
  );
};

export default ExtraFormats;
