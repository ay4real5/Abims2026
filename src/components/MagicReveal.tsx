"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Two acts, timed against the slow-motion flap (mounted when opening starts):
 *   Act I  (0 – 1.5s)  — hush: a few gold motes drift up in slow motion
 *   Act II (1.5s –)    — the explosion: flash, shockwave, radial gold burst,
 *                        then glitter raining softly as the invitation appears
 */

const BOOM = 1.5; // seconds after mount

// Act I — slow drifting motes
const MOTES = [
  { x: 34, y: 66, s: 7, delay: 0.0 },
  { x: 48, y: 72, s: 9, delay: 0.25 },
  { x: 62, y: 65, s: 6, delay: 0.5 },
  { x: 42, y: 58, s: 6, delay: 0.7 },
  { x: 56, y: 60, s: 8, delay: 0.9 },
];

// Act II — radial burst, deterministic spread
const BURST = Array.from({ length: 36 }, (_, i) => {
  const angle = (i * 10 + (i % 3) * 4) * (Math.PI / 180);
  const dist = 26 + ((i * 7) % 24); // vmin
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist * 0.9,
    s: 6 + ((i * 5) % 13),
    d: 1.5 + ((i * 3) % 10) / 12,
    star: i % 3 !== 1,
  };
});

// Act II coda — glitter falling
const FALL = Array.from({ length: 14 }, (_, i) => ({
  x: 6 + ((i * 41) % 88),
  y: 8 + ((i * 23) % 30),
  s: 5 + ((i * 3) % 8),
  delay: BOOM + 0.5 + (i % 7) * 0.18,
  drop: 24 + ((i * 11) % 20),
}));

const Star = ({ size, tone = "#eed398" }: { size: number; tone?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 2 C13 8 16 11 22 12 C16 13 13 16 12 22 C11 16 8 13 2 12 C8 11 11 8 12 2 Z"
      fill={tone}
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
      {/* ═ Act I — slow-motion hush ═ */}
      {MOTES.map((m, i) => (
        <motion.div
          key={`m${i}`}
          className="absolute"
          style={{ left: `${m.x}%`, top: `${m.y}%`, filter: "drop-shadow(0 0 6px rgba(238,211,152,0.8))" }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0, 1, 0.6], y: -40 }}
          transition={{ duration: 2.2, delay: m.delay, ease: "easeOut" }}
        >
          <Dust size={m.s} />
        </motion.div>
      ))}

      {/* ═ Act II — the explosion ═ */}
      {/* white-gold flash */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 55%, rgba(255,244,214,0.95) 0%, rgba(250,224,160,0.55) 40%, rgba(250,224,160,0) 75%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: BOOM + 0.7, times: [0, BOOM / (BOOM + 0.7), (BOOM + 0.12) / (BOOM + 0.7), 1], ease: "easeOut" }}
      />
      {/* shockwave ring */}
      <motion.div
        className="absolute left-1/2 top-[55%] h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ border: "2px solid rgba(240,208,140,0.8)", boxShadow: "0 0 40px rgba(240,208,140,0.6), inset 0 0 30px rgba(240,208,140,0.4)" }}
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: [0, 0.9, 0], scale: [0.1, 3.2, 4.2] }}
        transition={{ duration: 1.6, delay: BOOM, ease: [0.1, 0.8, 0.2, 1] }}
      />
      {/* second, slower ring */}
      <motion.div
        className="absolute left-1/2 top-[55%] h-[30vmin] w-[30vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ border: "1px solid rgba(240,208,140,0.5)" }}
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.1, 2.2, 3.4] }}
        transition={{ duration: 2.2, delay: BOOM + 0.15, ease: [0.1, 0.8, 0.2, 1] }}
      />

      {/* radial gold burst */}
      {BURST.map((b, i) => (
        <motion.div
          key={`b${i}`}
          className="absolute left-1/2 top-[55%]"
          style={{ filter: "drop-shadow(0 0 8px rgba(238,211,152,1))" }}
          initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
          animate={{
            opacity: [0, 1, 0.9, 0],
            scale: [0.2, 1.2, 0.9, 0.3],
            x: `calc(-50% + ${b.dx}vmin)`,
            y: `calc(-50% + ${b.dy}vmin)`,
            rotate: b.star ? 160 : 0,
          }}
          transition={{ duration: b.d, delay: BOOM, ease: [0.05, 0.85, 0.25, 1] }}
        >
          {b.star ? <Star size={b.s} /> : <Dust size={b.s} />}
        </motion.div>
      ))}

      {/* glitter raining down as the page settles */}
      {FALL.map((f, i) => (
        <motion.div
          key={`f${i}`}
          className="absolute"
          style={{ left: `${f.x}%`, top: `${f.y}%`, filter: "drop-shadow(0 0 5px rgba(238,211,152,0.8))" }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0.7, 0], scale: [0, 1, 0.8, 0.2], y: `${f.drop}vmin`, rotate: 120 }}
          transition={{ duration: 2.6, delay: f.delay, ease: "easeIn" }}
        >
          <Star size={f.s} tone="#e9cc8a" />
        </motion.div>
      ))}
    </div>
  );
}
