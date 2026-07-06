import { site } from "@/config/site";

/**
 * Fullscreen top flap — a triangle from the top edge down to the point at
 * 58dvh. The outer face carries the couple's names in calligraphy and the
 * date, exactly like a hand-addressed envelope.
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

      {face === "outer" && (
        // sits within the flap triangle — near the top where it is widest,
        // long names stacked around the ampersand so nothing crosses a crease
        <div className="absolute inset-x-0 top-[5%] mx-auto flex w-[72%] flex-col items-center text-center">
          {(() => {
            const parts = site.coupleNames.split("&").map((p) => p.trim());
            const script = {
              fontFamily: "var(--font-script), cursive",
              color: "#5b4a35",
              textShadow: "0 1px 0 rgba(255,250,238,0.8)",
            };
            return parts.length === 2 ? (
              <h1 className="leading-[1.15]" style={{ ...script, fontSize: "clamp(30px, 8.5vw, 44px)" }}>
                {parts[0]}
                <span className="mx-2" style={{ fontSize: "0.7em", color: "#8f7340" }}>
                  &amp;
                </span>
                <br />
                {parts[1]}
              </h1>
            ) : (
              <h1 className="leading-tight" style={{ ...script, fontSize: "clamp(34px, 10vw, 52px)" }}>
                {site.coupleNames}
              </h1>
            );
          })()}
          <p
            className="mt-3 text-[10px] font-light uppercase"
            style={{
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.3em",
              color: "#8a7a63",
            }}
          >
            {site.dateLine}
          </p>
        </div>
      )}
    </div>
  );
}
