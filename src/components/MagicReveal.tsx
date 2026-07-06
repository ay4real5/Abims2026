"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The magic moment — plays once as the flap lifts and the invitation
 * appears: a warm glow blooms from the seal point while gold sparkles
 * drift up and twinkle out.
 */

type Spark = { x: number; y: number; s: number; d: number; delay: number; drift: number };

// hand-placed so the composition is balanced, not random each render
const SPARKS: Spark[] = [
  { x: 18, y: 62, s: 14, d: 2.2, delay: 0.1, drift: -30 },
  { x: 30, y: 70, s: 9, d: 1.8, delay: 0.35, drift: -22 },
  { x: 42, y: 58, s: 12, d: 2.4, delay: 0.05, drift: -34 },
  { x: 50, y: 66, s: 16, d: 2.6, delay: 0.2, drift: -40 },
  { x: 58, y: 60, s: 10, d: 2.0, delay: 0.5, drift: -26 },
  { x: 70, y: 68, s: 13, d: 2.3, delay: 0.15, drift: -32 },
  { x: 82, y: 61, s: 9, d: 1.9, delay: 0.4, drift: -24 },
  { x: 25, y: 45, s: 8, d: 2.0, delay: 0.6, drift: -20 },
  { x: 38, y: 38, s: 11, d: 2.2, delay: 0.75, drift: -26 },
  { x: 55, y: 42, s: 9, d: 1.8, delay: 0.9, drift: -22 },
  { x: 68, y: 36, s: 12, d: 2.4, delay: 0.65, drift: -28 },
  { x: 78, y: 46, s: 8, d: 2.0, delay: 0.85, drift: -18 },
  { x: 15, y: 30, s: 9, d: 2.1, delay: 1.0, drift: -20 },
  { x: 47, y: 24, s: 10, d: 2.3, delay: 1.1, drift: -24 },
  { x: 85, y: 28, s: 9, d: 2.0, delay: 1.2, drift: -20 },
  { x: 62, y: 18, s: 8, d: 1.9, delay: 1.35, drift: -16 },
];

const Star = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z"
      fill="#e9cc8a"
    />
  </svg>
);

export default function MagicReveal() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {/* glow blooming from the seal point */}
      <motion.div
        className="absolute left-1/2 top-[58%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(238,206,138,0.55), rgba(238,206,138,0.15) 55%, transparent 75%)",
        }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 1, 0], scale: [0.2, 1.6, 2.4] }}
        transition={{ duration: 2.4, ease: "easeOut" }}
      />
      {/* soft light sweep upward */}
      <motion.div
        className="absolute inset-x-0 h-[45%]"
        style={{
          background:
            "linear-gradient(to top, rgba(248,232,196,0) 0%, rgba(248,232,196,0.5) 50%, rgba(248,232,196,0) 100%)",
        }}
        initial={{ top: "70%", opacity: 0 }}
        animate={{ top: "-45%", opacity: [0, 0.8, 0] }}
        transition={{ duration: 2.0, delay: 0.3, ease: [0.3, 0, 0.3, 1] }}
      />

      {SPARKS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: "drop-shadow(0 0 6px rgba(233,204,138,0.9))",
          }}
          initial={{ opacity: 0, scale: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0.7, 0],
            scale: [0, 1, 0.7, 0],
            y: [0, p.drift * 0.5, p.drift],
            rotate: [0, 90],
          }}
          transition={{ duration: p.d, delay: p.delay, ease: "easeOut" }}
        >
          <Star size={p.s} />
        </motion.div>
      ))}
    </div>
  );
}
