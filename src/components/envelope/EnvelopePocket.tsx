/**
 * Fullscreen envelope back: the two side folds and the bottom fold,
 * creases converging on the flap point at (50, 58) of a 100×100 space.
 * Stretched edge-to-edge; strokes stay hairline via non-scaling-stroke.
 */
const POINT_Y = 58;

export default function EnvelopePocket() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="ep-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ece2cc" />
          <stop offset="1" stopColor="#e2d5b8" />
        </linearGradient>
        <linearGradient id="ep-right" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#ece2cc" />
          <stop offset="1" stopColor="#e2d5b8" />
        </linearGradient>
        <linearGradient id="ep-bottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f0e7d2" />
          <stop offset="0.7" stopColor="#e7dabf" />
          <stop offset="1" stopColor="#e0d2b2" />
        </linearGradient>
      </defs>

      {/* side folds */}
      <polygon points={`0,0 50,${POINT_Y} 0,100`} fill="url(#ep-left)" />
      <polygon points={`100,0 50,${POINT_Y} 100,100`} fill="url(#ep-right)" />
      {/* bottom fold overlaps the sides */}
      <polygon points={`0,100 50,${POINT_Y} 100,100`} fill="url(#ep-bottom)" />

      {/* crease shadows + catchlights along the bottom fold edges */}
      <line x1="0" y1="100" x2="50" y2={POINT_Y} stroke="rgba(120,98,62,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="100" x2="50" y2={POINT_Y} stroke="rgba(120,98,62,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="0" y1="100" x2="50" y2={POINT_Y + 0.4} stroke="rgba(255,250,238,0.7)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="100" x2="50" y2={POINT_Y + 0.4} stroke="rgba(255,250,238,0.7)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
