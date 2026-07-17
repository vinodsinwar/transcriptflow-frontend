/**
 * TranscriptFlow mark: a play triangle dissolving into transcript lines —
 * "video becomes text". Used in header, footer, favicon, and og-image.
 */
const Logo = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="tf-mark-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#tf-mark-g)" />
    <polygon points="7,8.5 14.5,12.75 7,17" fill="#fff" />
    <rect x="17.5" y="9" width="7.5" height="2.5" rx="1.25" fill="#fff" opacity="0.95" />
    <rect x="17.5" y="13.5" width="5" height="2.5" rx="1.25" fill="#fff" opacity="0.75" />
    <rect x="7" y="19.5" width="18" height="2.5" rx="1.25" fill="#fff" opacity="0.9" />
    <rect x="7" y="24" width="12.5" height="2.5" rx="1.25" fill="#fff" opacity="0.6" />
  </svg>
);

export default Logo;
