"use client";

import { motion, type MotionValue, useTransform } from "framer-motion";

/**
 * A depth field of gold dust. Three bands — far (small, slow, sharp),
 * mid, and near (large, blurred, fast) — each drifting forever and shifting
 * against the pointer so moving your phone feels like moving through the air.
 */

type Band = { count: number; size: [number, number]; blur: number; depth: number; dur: [number, number]; opacity: [number, number] };

const BANDS: Band[] = [
  { count: 26, size: [2, 4], blur: 0, depth: 6, dur: [16, 26], opacity: [0.25, 0.6] },
  { count: 14, size: [4, 8], blur: 1.5, depth: 16, dur: [12, 20], opacity: [0.2, 0.5] },
  { count: 6, size: [10, 22], blur: 6, depth: 34, dur: [10, 16], opacity: [0.12, 0.28] },
];

// deterministic pseudo-random so SSR and client agree
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function ParticleField({
  px,
  py,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {BANDS.map((band, bi) => (
        <Layer key={bi} band={band} bi={bi} px={px} py={py} />
      ))}
    </div>
  );
}

function Layer({
  band,
  bi,
  px,
  py,
}: {
  band: Band;
  bi: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const tx = useTransform(px, (v) => v * -band.depth);
  const ty = useTransform(py, (v) => v * -band.depth);
  const rand = rng(bi * 1000 + 7);

  return (
    <motion.div className="absolute inset-0" style={{ x: tx, y: ty }}>
      {Array.from({ length: band.count }).map((_, i) => {
        const left = rand() * 100;
        const top = rand() * 100;
        const size = band.size[0] + rand() * (band.size[1] - band.size[0]);
        const dur = band.dur[0] + rand() * (band.dur[1] - band.dur[0]);
        const delay = -rand() * dur;
        const op = band.opacity[0] + rand() * (band.opacity[1] - band.opacity[0]);
        const drift = 20 + rand() * 40;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background:
                "radial-gradient(circle at 35% 35%, #f4e2b0, #c8a25c 60%, rgba(200,162,92,0) 100%)",
              filter: band.blur ? `blur(${band.blur}px)` : undefined,
              boxShadow: bi === 0 ? "0 0 6px rgba(217,185,117,0.7)" : undefined,
            }}
            animate={{
              y: [0, -drift, 0],
              x: [0, drift * 0.4, 0],
              opacity: [op * 0.4, op, op * 0.4],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </motion.div>
  );
}
