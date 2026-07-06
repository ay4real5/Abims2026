"use client";

import { motion, useReducedMotion } from "framer-motion";
import Envelope from "./Envelope";

/** Grain for the room itself — keeps the dark from reading as flat pixels. */
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const easeOutLong: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function EnvelopeScene() {
  const reduced = useReducedMotion();

  return (
    <main
      className="relative grid h-[100dvh] place-items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 36%, #262019 0%, #171209 48%, #0c0906 100%)",
      }}
    >
      {/* warm light pool behind the envelope */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(214,178,110,0.13), rgba(214,178,110,0.04) 55%, transparent 75%)",
        }}
      />

      {/* film grain over the whole room */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px" }}
      />

      {/* envelope — fades in, then floats forever */}
      <motion.div
        className="relative"
        style={{ width: "min(85vw, 420px)" }}
        initial={{ opacity: 0, y: 26, scale: 0.965 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduced ? { duration: 0 } : { duration: 2.4, delay: 0.5, ease: easeOutLong }
        }
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -9, 0], rotate: [0, 0.45, 0, -0.35, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))" }}
        >
          <Envelope />
        </motion.div>

        {/* contact shadow on the floor beneath */}
        <motion.div
          aria-hidden
          className="absolute -bottom-12 left-1/2 h-7 w-[68%] -translate-x-1/2 rounded-[50%] blur-xl"
          style={{ background: "rgba(0,0,0,0.55)" }}
          initial={{ opacity: 0 }}
          animate={
            reduced
              ? { opacity: 0.5 }
              : { opacity: [0.55, 0.4, 0.55], scaleX: [1, 0.94, 1] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
        />
      </motion.div>
    </main>
  );
}
