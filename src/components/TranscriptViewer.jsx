import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

/**
 * Full reading view for a transcript: search/filter with highlighting,
 * clickable timestamps that jump into the video.
 */
const TranscriptViewer = ({ transcript, videoId }) => {
  const [query, setQuery] = useState('');

  const lines = useMemo(() => (transcript || '').split('\n'), [transcript]);
  const trimmed = query.trim().toLowerCase();
  const visible = trimmed
    ? lines.filter((line) => line.toLowerCase().includes(trimmed))
    : lines;

  const highlight = (text) => {
    if (!trimmed) return text;
    const parts = [];
    let rest = text;
    let i = rest.toLowerCase().indexOf(trimmed);
    let key = 0;
    while (i !== -1) {
      parts.push(rest.slice(0, i));
      parts.push(
        <mark key={key++} className="bg-primary/40 text-inherit rounded px-0.5">
          {rest.slice(i, i + trimmed.length)}
        </mark>
      );
      rest = rest.slice(i + trimmed.length);
      i = rest.toLowerCase().indexOf(trimmed);
    }
    parts.push(rest);
    return parts;
  };

  return (
    <div className="glass p-4 sm:p-6 rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h4 className="text-lg font-semibold">Transcript</h4>
        <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in transcript…"
            className="input-modern w-full pl-9 pr-3 py-2 text-sm"
            aria-label="Search in transcript"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {trimmed
          ? `${visible.length} matching line${visible.length === 1 ? '' : 's'}`
          : 'Tip: click a timestamp to jump to that moment on YouTube'}
      </p>
      <div className="bg-background/50 p-4 sm:p-6 rounded-lg min-h-[40vh] max-h-[75vh] overflow-y-auto">
        <div className="text-[15px] leading-7 space-y-1.5 text-left">
          {visible.length === 0 && (
            <p className="text-muted-foreground">No lines match "{query}".</p>
          )}
          {visible.map((line, i) => {
            const match = line.match(/^\[(\d+):(\d{2})\]\s?(.*)$/);
            if (!match) return <div key={i}>{highlight(line)}</div>;
            const seconds = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
            return (
              <div key={i}>
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-mono text-sm"
                  title="Jump to this moment on YouTube"
                >
                  [{match[1]}:{match[2]}]
                </a>{' '}
                {highlight(match[3])}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TranscriptViewer;
