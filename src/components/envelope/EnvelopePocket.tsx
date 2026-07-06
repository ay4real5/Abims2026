/**
 * The front pocket of the envelope (as seen from the flap side):
 * both side flaps and the bottom flap, with grain, sheen and paper thickness.
 * The area above the fold diagonals is transparent — the card shows through
 * once the top flap lifts.
 */
export default function EnvelopePocket() {
  return (
    <svg viewBox="0 0 700 500" className="block h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id="ep-flapBottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e9dcbf" />
          <stop offset="1" stopColor="#e0d0ae" />
        </linearGradient>
        <linearGradient id="ep-flapLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e7dabc" />
          <stop offset="1" stopColor="#dcccaa" />
        </linearGradient>
        <linearGradient id="ep-flapRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#e7dabc" />
          <stop offset="1" stopColor="#dcccaa" />
        </linearGradient>
        <linearGradient id="ep-sheen" x1="0" y1="0" x2="1" y2="0.9" gradientTransform="rotate(-12 0.5 0.5)">
          <stop offset="0" stopColor="#fffbee" stopOpacity="0" />
          <stop offset="0.22" stopColor="#fffbee" stopOpacity="0.16" />
          <stop offset="0.4" stopColor="#fffbee" stopOpacity="0" />
          <stop offset="1" stopColor="#fffbee" stopOpacity="0" />
        </linearGradient>
        <filter id="ep-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.65 0.65 0.65 0 0" />
        </filter>
        <filter id="ep-edgeShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#5a4426" floodOpacity="0.18" />
        </filter>
        <filter id="ep-flapShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4.5" stdDeviation="5" floodColor="#4d3820" floodOpacity="0.36" />
        </filter>
        <clipPath id="ep-clip">
          <rect x="0" y="0" width="700" height="500" rx="10" />
        </clipPath>
        {/* everything the pocket paints, for clipping grain/sheen to paper only */}
        <clipPath id="ep-pocketShape">
          <path d="M 4 16 C 120 128 245 218 352 288 C 245 358 120 425 4 486 Z" />
          <path d="M 696 16 C 580 128 455 218 348 288 C 455 358 580 425 696 486 Z" />
          <path d="M 2 494 C 130 424 242 356 350 304 C 458 356 570 424 698 494 Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#ep-clip)">
        {/* side flaps */}
        <path
          d="M 4 16 C 120 128 245 218 352 288 C 245 358 120 425 4 486 Z"
          fill="url(#ep-flapLeft)"
          filter="url(#ep-edgeShadow)"
        />
        <path
          d="M 696 16 C 580 128 455 218 348 288 C 455 358 580 425 696 486 Z"
          fill="url(#ep-flapRight)"
          filter="url(#ep-edgeShadow)"
        />

        {/* bottom flap */}
        <path
          d="M 2 494 C 130 424 242 356 350 304 C 458 356 570 424 698 494 Z"
          fill="url(#ep-flapBottom)"
          filter="url(#ep-flapShadow)"
        />
        {/* crease highlights along the bottom flap edges */}
        <path
          d="M 8 490 C 134 421 244 355 350 304"
          fill="none"
          stroke="rgba(255,248,230,0.5)"
          strokeWidth="1"
        />
        <path
          d="M 692 490 C 566 421 456 355 350 304"
          fill="none"
          stroke="rgba(255,248,230,0.5)"
          strokeWidth="1"
        />

        {/* grain + sheen, only on the paper itself */}
        <g clipPath="url(#ep-pocketShape)">
          <rect x="0" y="0" width="700" height="500" filter="url(#ep-grain)" opacity="0.09" />
          <rect
            x="-100"
            y="-100"
            width="900"
            height="700"
            fill="url(#ep-sheen)"
            style={{ mixBlendMode: "soft-light" }}
          />
        </g>

        {/* paper thickness on the lower edge */}
        <path
          d="M 10 498 L 690 498"
          stroke="rgba(70,52,28,0.35)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
