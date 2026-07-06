/**
 * The interior back wall of the envelope — only visible once the flap lifts.
 * Slightly darker than the outer paper, with a soft inner vignette.
 */
export default function EnvelopeBase() {
  return (
    <svg viewBox="0 0 700 500" className="block h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="eb-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3c19c" />
          <stop offset="1" stopColor="#c9b58e" />
        </linearGradient>
        <radialGradient id="eb-vignette" cx="0.5" cy="0.35" r="0.9">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#3a2c16" stopOpacity="0.35" />
        </radialGradient>
        <filter id="eb-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.65 0.65 0.65 0 0" />
        </filter>
        <clipPath id="eb-clip">
          <rect x="0" y="0" width="700" height="500" rx="10" />
        </clipPath>
      </defs>
      <g clipPath="url(#eb-clip)">
        <rect x="0" y="0" width="700" height="500" rx="10" fill="url(#eb-paper)" />
        <rect x="0" y="0" width="700" height="500" fill="url(#eb-vignette)" />
        <rect x="0" y="0" width="700" height="500" filter="url(#eb-grain)" opacity="0.07" />
      </g>
    </svg>
  );
}
