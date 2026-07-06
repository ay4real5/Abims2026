/**
 * The top flap, as its own layer so it can rotate in real 3D.
 * `face="outer"` is the sealed side the guest first sees;
 * `face="inner"` is the underside revealed as it lifts.
 * viewBox height 335 ≈ the flap's reach (0 → y 330 of the 500-tall envelope).
 */
export default function TopFlap({ face }: { face: "outer" | "inner" }) {
  const id = face === "outer" ? "tfo" : "tfi";
  return (
    <svg viewBox="0 0 700 335" className="block h-auto w-full" aria-hidden>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          {face === "outer" ? (
            <>
              <stop offset="0" stopColor="#f2e8d2" />
              <stop offset="0.75" stopColor="#e5d6b6" />
              <stop offset="1" stopColor="#dbc9a5" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#dbc9a3" />
              <stop offset="1" stopColor="#cfbb92" />
            </>
          )}
        </linearGradient>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.65 0.65 0.65 0 0" />
        </filter>
        <filter id={`${id}-shadow`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4.5" stdDeviation="5" floodColor="#4d3820" floodOpacity="0.36" />
        </filter>
        <clipPath id={`${id}-shape`}>
          <path d="M 2 8 L 698 8 C 652 58 500 180 350 330 C 200 180 48 58 2 8 Z" />
        </clipPath>
      </defs>

      <path
        d="M 2 8 L 698 8 C 652 58 500 180 350 330 C 200 180 48 58 2 8 Z"
        fill={`url(#${id}-fill)`}
        filter={face === "outer" ? `url(#${id}-shadow)` : undefined}
      />
      <g clipPath={`url(#${id}-shape)`}>
        <rect x="0" y="0" width="700" height="335" filter={`url(#${id}-grain)`} opacity="0.09" />
      </g>
      {face === "outer" && (
        <>
          {/* fold crease where the flap bends over the top edge */}
          <line x1="6" y1="10" x2="694" y2="10" stroke="rgba(90,68,38,0.22)" strokeWidth="1.5" />
          <line x1="6" y1="12" x2="694" y2="12" stroke="rgba(255,250,235,0.55)" strokeWidth="0.8" />
        </>
      )}
    </svg>
  );
}
