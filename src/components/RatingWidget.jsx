import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://transcriptflow-backend.onrender.com';

// Canonical page metadata for the schema injection.
const PAGE_META = {
  home: { name: 'TranscriptFlow — YouTube Transcript Generator', url: 'https://transcriptflow.io' },
  playlist: { name: 'TranscriptFlow Pro — Playlist Transcript Downloader', url: 'https://transcriptflow.io/youtube-playlist-transcript' },
  translate: { name: 'TranscriptFlow — YouTube Transcript Translator', url: 'https://transcriptflow.io/translate-youtube-transcript' },
  download: { name: 'TranscriptFlow — YouTube Subtitle Downloader', url: 'https://transcriptflow.io/download-youtube-subtitles' },
};

// Inject AggregateRating JSON-LD once real votes exist. The schema number is
// ALWAYS the same live number rendered visibly next to the stars — that
// visible/markup parity is what keeps this within Google's rules.
const injectSchema = (page, average, count) => {
  if (count < 5 || typeof document === 'undefined') return;
  const id = `rating-schema-${page}`;
  if (document.getElementById(id)) return;
  const meta = PAGE_META[page];
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: meta.name,
    url: meta.url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: average,
      ratingCount: count,
      bestRating: 5,
      worstRating: 1,
    },
  });
  document.head.appendChild(script);
};

/**
 * Honest on-page rating: real votes, live visible aggregate, one vote per
 * browser (localStorage) + per IP (server). compact renders a single line.
 */
const RatingWidget = ({ page = 'home', prompt = 'Rate this tool' }) => {
  const [agg, setAgg] = useState(null);          // {average, count}
  const [myRating, setMyRating] = useState(() => {
    try { return parseInt(localStorage.getItem(`tf_rated_${page}`), 10) || 0; } catch { return 0; }
  });
  const [hover, setHover] = useState(0);
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/ratings?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAgg({ average: d.average, count: d.count });
          injectSchema(page, d.average, d.count);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const vote = async (rating) => {
    if (myRating) return;
    setMyRating(rating);
    setJustRated(true);
    try { localStorage.setItem(`tf_rated_${page}`, String(rating)); } catch { /* private mode */ }
    // Optimistic aggregate bump so the visible number responds immediately.
    setAgg((prev) => {
      const count = (prev?.count || 0) + 1;
      const average = Math.round((((prev?.average || 0) * (prev?.count || 0)) + rating) / count * 10) / 10;
      return { average, count };
    });
    try {
      await fetch(`${BACKEND_URL}/api/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, rating }),
      });
    } catch { /* vote stays local; server unreachable */ }
  };

  const display = hover || myRating;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-sm text-muted-foreground">
        {justRated ? `Thanks — you rated it ${myRating}★` : myRating ? `You rated this ${myRating}★` : prompt}
      </span>
      <div className="flex items-center" role="radiogroup" aria-label="Rate this tool from 1 to 5 stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={myRating === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            disabled={!!myRating}
            onMouseEnter={() => !myRating && setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => vote(n)}
            className={`p-0.5 transition-transform ${myRating ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          >
            <Star
              className="w-5 h-5"
              fill={n <= display ? 'var(--marker)' : 'transparent'}
              stroke={n <= display ? 'var(--foreground)' : 'var(--muted-foreground)'}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {agg && agg.count >= 5 && (
        <span className="text-sm text-muted-foreground font-mono">
          {agg.average} · {agg.count.toLocaleString()} rating{agg.count === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
};

export default RatingWidget;
