"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The magic moment — plays once as the flap lifts: light rays turn slowly
 * behind a blooming double glow while a field of gold stars and dust motes
 * rises, sways and twinkles out around the appearing invitation.
 */

type Spark = {
  x: number; y: number; s: number; d: number; delay: number;
  rise: number; sway: number; kind: "star" | "dust";
};

// hand-placed field: lower band ignites first, upper band follows
const SPARKS: Spark[] = [
  { x: 12, y: 66, s: 16, d: 2.8, delay: 0.05, rise: -46, sway: 8, kind: "star" },
  { x: 22, y: 72, s: 9, d: 2.2, delay: 0.3, rise: -34, sway: -6, kind: "dust" },
  { x: 31, y: 60, s: 13, d: 3.0, delay: 0.1, rise: -50, sway: 10, kind: "star" },
  { x: 40, y: 74, s: 8, d: 2.4, delay: 0.45, rise: -38, sway: -8, kind: "dust" },
  { x: 50, y: 64, s: 20, d: 3.2, delay: 0.15, rise: -56, sway: 6, kind: "star" },
  { x: 60, y: 73, s: 9, d: 2.3, delay: 0.55, rise: -36, sway: 9, kind: "dust" },
  { x: 69, y: 61, s: 14, d: 2.9, delay: 0.2, rise: -48, sway: -10, kind: "star" },
  { x: 79, y: 70, s: 8, d: 2.2, delay: 0.4, rise: -32, sway: 7, kind: "dust" },
  { x: 88, y: 64, s: 12, d: 2.7, delay: 0.25, rise: -44, sway: -7, kind: "star" },
  { x: 8, y: 50, s: 8, d: 2.4, delay: 0.7, rise: -30, sway: 6, kind: "dust" },
  { x: 18, y: 42, s: 12, d: 2.8, delay: 0.8, rise: -40, sway: -9, kind: "star" },
  { x: 28, y: 50, s: 7, d: 2.2, delay: 0.95, rise: -28, sway: 6, kind: "dust" },
  { x: 37, y: 40, s: 10, d: 2.6, delay: 0.85, rise: -36, sway: 8, kind: "star" },
  { x: 47, y: 47, s: 8, d: 2.3, delay: 1.05, rise: -30, sway: -6, kind: "dust" },
  { x: 57, y: 39, s: 13, d: 2.9, delay: 0.75, rise: -42, sway: 9, kind: "star" },
  { x: 67, y: 48, s: 7, d: 2.2, delay: 1.1, rise: -26, sway: -7, kind: "dust" },
  { x: 76, y: 41, s: 11, d: 2.7, delay: 0.9, rise: -38, sway: 8, kind: "star" },
  { x: 86, y: 49, s: 8, d: 2.4, delay: 1.0, rise: -30, sway: -6, kind: "dust" },
  { x: 14, y: 26, s: 9, d: 2.5, delay: 1.2, rise: -28, sway: 7, kind: "star" },
  { x: 26, y: 20, s: 7, d: 2.2, delay: 1.35, rise: -22, sway: -5, kind: "dust" },
  { x: 38, y: 27, s: 11, d: 2.7, delay: 1.25, rise: -30, sway: 8, kind: "star" },
  { x: 50, y: 18, s: 14, d: 3.0, delay: 1.3, rise: -34, sway: -6, kind: "star" },
  { x: 62, y: 25, s: 7, d: 2.3, delay: 1.45, rise: -24, sway: 6, kind: "dust" },
  { x: 73, y: 19, s: 10, d: 2.6, delay: 1.4, rise: -28, sway: -8, kind: "star" },
  { x: 85, y: 26, s: 8, d: 2.4, delay: 1.5, rise: -26, sway: 6, kind: "dust" },
  { x: 20, y: 10, s: 8, d: 2.4, delay: 1.6, rise: -20, sway: 5, kind: "dust" },
  { x: 45, y: 8, s: 10, d: 2.6, delay: 1.7, rise: -22, sway: -6, kind: "star" },
  { x: 70, y: 9, s: 8, d: 2.3, delay: 1.65, rise: -20, sway: 6, kind: "dust" },
  { x: 92, y: 12, s: 9, d: 2.5, delay: 1.75, rise: -22, sway: -5, kind: "star" },
  { x: 5, y: 14, s: 9, d: 2.5, delay: 1.55, rise: -22, sway: 6, kind: "star" },
];

const Star = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z"
      fill="#eed398"
    />
  </svg>
);

const Dust = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden>
    <circle cx="5" cy="5" r="4" fill="#e3c37e" />
  </svg>
);

export default function MagicReveal() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {/* slowly turning light rays behind everything */}
      <motion.div
        className="absolute left-1/2 top-[45%] h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(248,228,182,0) 0deg, rgba(248,228,182,0.35) 12deg, rgba(248,228,182,0) 28deg, rgba(248,228,182,0) 90deg, rgba(248,228,182,0.28) 104deg, rgba(248,228,182,0) 120deg, rgba(248,228,182,0) 182deg, rgba(248,228,182,0.32) 196deg, rgba(248,228,182,0) 212deg, rgba(248,228,182,0) 275deg, rgba(248,228,182,0.26) 290deg, rgba(248,228,182,0) 305deg)",
        }}
        initial={{ opacity: 0, rotate: -8 }}
        animate={{ opacity: [0, 0.9, 0], rotate: 14 }}
        transition={{ duration: 3.6, ease: "easeInOut" }}
      />

      {/* double glow bloom from the seal point */}
      <motion.div
        className="absolute left-1/2 top-[58%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(240,208,140,0.65), rgba(240,208,140,0.2) 55%, transparent 75%)",
        }}
        initial={{ opacity: 0, scale: 0.15 }}
        animate={{ opacity: [0, 1, 0.35, 0.7, 0], scale: [0.15, 1.3, 1.9, 2.3, 2.9] }}
        transition={{ duration: 3.2, ease: "easeOut" }}
      />

      {/* soft light sweep upward */}
      <motion.div
        className="absolute inset-x-0 h-[50%]"
        style={{
          background:
            "linear-gradient(to top, rgba(248,232,196,0) 0%, rgba(248,232,196,0.55) 50%, rgba(248,232,196,0) 100%)",
        }}
        initial={{ top: "75%", opacity: 0 }}
        animate={{ top: "-50%", opacity: [0, 0.9, 0] }}
        transition={{ duration: 2.4, delay: 0.35, ease: [0.3, 0, 0.3, 1] }}
      />

      {SPARKS.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: "drop-shadow(0 0 7px rgba(238,211,152,0.95))",
          }}
          initial={{ opacity: 0, scale: 0, y: 0, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 0.85, 0.5, 0],
            scale: [0, 1.1, 0.9, 0.6, 0],
            y: [0, p.rise * 0.4, p.rise * 0.75, p.rise],
            x: [0, p.sway, -p.sway * 0.5, p.sway * 0.8],
            rotate: p.kind === "star" ? [0, 120] : 0,
          }}
          transition={{ duration: p.d, delay: p.delay, ease: "easeOut" }}
        >
          {p.kind === "star" ? <Star size={p.s} /> : <Dust size={p.s} />}
        </motion.div>
      ))}
    </div>
  );
}
