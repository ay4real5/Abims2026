"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The burst that fires at the portal moment — a full-screen eruption of gold
 * that rushes past the camera as we fly through the envelope's mouth.
 * Rendered only for the ~2s of the transition.
 */

const RAYS = 16;
const BURST = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2 + (i % 4) * 0.12;
  const dist = 40 + ((i * 13) % 70); // vmax — many fly clear off-screen (past camera)
  return {
    dx: Math.cos(angle) * dist,
    dy: Math.sin(angle) * dist,
    s: 5 + ((i * 7) % 20),
    d: 0.9 + ((i * 5) % 10) / 10,
    star: i % 3 !== 0,
  };
});

const Star = ({ size, tone = "#f0d79a" }: { size: number; tone?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
    <path
      d="M12 1 C13.2 8.6 15.4 10.8 23 12 C15.4 13.2 13.2 15.4 12 23 C10.8 15.4 8.6 13.2 1 12 C8.6 10.8 10.8 8.6 12 1 Z"
      fill={tone}
    />
  </svg>
);

export default function MagicReveal() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      {/* white-gold flash filling the frame */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 52%, rgba(255,248,224,1) 0%, rgba(250,226,166,0.7) 35%, rgba(250,226,166,0) 72%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.35, 0] }}
        transition={{ duration: 1.8, times: [0, 0.12, 0.4, 1], ease: "easeOut" }}
      />

      {/* radiant light rays sweeping out from the opening */}
      <motion.div
        className="absolute left-1/2 top-[52%] h-[220vmax] w-[220vmax] -translate-x-1/2 -translate-y-1/2"
        style={{
          background: `repeating-conic-gradient(from 0deg, rgba(255,240,200,0.5) 0deg, rgba(255,240,200,0) ${360 / RAYS / 2}deg, rgba(255,240,200,0) ${360 / RAYS}deg)`,
        }}
        initial={{ opacity: 0, scale: 0.1, rotate: 0 }}
        animate={{ opacity: [0, 0.85, 0], scale: [0.1, 1, 1.3], rotate: 20 }}
        transition={{ duration: 1.9, ease: "easeOut" }}
      />

      {/* expanding shockwave rings */}
      {[0, 0.12].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[52%] h-[26vmin] w-[26vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ border: `${2 - i}px solid rgba(240,208,140,${0.8 - i * 0.3})`, boxShadow: "0 0 40px rgba(240,208,140,0.5)" }}
          initial={{ opacity: 0, scale: 0.1 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.1, 5 + i * 2] }}
          transition={{ duration: 1.6 + i * 0.4, delay, ease: [0.1, 0.8, 0.2, 1] }}
        />
      ))}

      {/* the eruption — gold flying past the viewer */}
      {BURST.map((b, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[52%]"
          style={{ filter: "drop-shadow(0 0 8px rgba(240,208,140,0.95))" }}
          initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.4, 1.8, 0.4],
            x: `calc(-50% + ${b.dx}vmax)`,
            y: `calc(-50% + ${b.dy}vmax)`,
            rotate: b.star ? 200 : 0,
          }}
          transition={{ duration: b.d, ease: [0.05, 0.7, 0.25, 1] }}
        >
          {b.star ? <Star size={b.s} /> : (
            <div
              className="rounded-full"
              style={{ width: b.s, height: b.s, background: "#e3c37e" }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
