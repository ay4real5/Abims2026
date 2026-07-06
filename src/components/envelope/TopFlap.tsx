/**
 * Fullscreen top flap — a triangle from the top edge down to the point at
 * 58dvh. Deliberately blank on the outside; the invitation is the surprise.
 */
export default function TopFlap({ face }: { face: "outer" | "inner" }) {
  const id = face === "outer" ? "tfo" : "tfi";
  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 100 58"
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
            {face === "outer" ? (
              <>
                <stop offset="0" stopColor="#f4ecda" />
                <stop offset="0.8" stopColor="#eadcbf" />
                <stop offset="1" stopColor="#e2d3b2" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#e0d2b2" />
                <stop offset="1" stopColor="#d4c49f" />
              </>
            )}
          </linearGradient>
        </defs>
        <polygon points="0,0 100,0 50,58" fill={`url(#${id}-fill)`} />
        {face === "outer" && (
          <>
            <line x1="0" y1="0" x2="50" y2="58" stroke="rgba(120,98,62,0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="100" y1="0" x2="50" y2="58" stroke="rgba(120,98,62,0.22)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </>
        )}
      </svg>

      {/* the outside of the envelope stays blank — everything is inside */}
    </div>
  );
}
