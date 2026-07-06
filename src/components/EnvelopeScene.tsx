"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import EnvelopeBase from "./envelope/EnvelopeBase";
import EnvelopePocket from "./envelope/EnvelopePocket";
import TopFlap from "./envelope/TopFlap";
import Seal from "./envelope/Seal";
import InvitationCard from "./InvitationCard";

/** Grain for the room itself — keeps the dark from reading as flat pixels. */
const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const easeOutLong: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeCinematic: [number, number, number, number] = [0.45, 0, 0.15, 1];

/**
 * sealed   – envelope floats, seal breathes
 * cracked  – wax fractures, halves fall away          (tap → +0 ms)
 * opening  – top flap rotates up in 3D                (+700 ms)
 * emerging – the card slides up out of the envelope   (+1500 ms)
 * revealed – envelope falls away, card locks centre   (+2600 ms)
 *
 * Layering: all parts are flat siblings so z-index stays reliable —
 * base(0) < card(20) < pocket(30) < flap(40 sealed / 10 open) < seal(50).
 * Only the flap uses preserve-3d, for its outer/inner faces.
 */
type Stage = "sealed" | "cracked" | "opening" | "emerging" | "revealed";

export default function EnvelopeScene() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("sealed");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // dev shortcut: /?open jumps to the revealed state, /?stage=emerging to any stage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("open")) setStage("revealed");
    const s = params.get("stage");
    if (s === "cracked" || s === "opening" || s === "emerging" || s === "revealed") setStage(s);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (stage !== "sealed") return;
    try {
      navigator.vibrate?.(12);
    } catch {}
    if (reduced) {
      setStage("revealed");
      return;
    }
    setStage("cracked");
    timers.current = [
      setTimeout(() => setStage("opening"), 700),
      setTimeout(() => setStage("emerging"), 1500),
      setTimeout(() => setStage("revealed"), 2600),
    ];
  }, [stage, reduced]);

  const sealed = stage === "sealed";
  const flapOpen = stage === "opening" || stage === "emerging" || stage === "revealed";
  const cardOut = stage === "emerging" || stage === "revealed";
  const done = stage === "revealed";

  /** the envelope's exit — applied to each part so the card can stay behind */
  const envelopeExit = done ? { opacity: 0, y: 60 } : { opacity: 1, y: 0 };
  const exitTransition = { duration: reduced ? 0 : 1.4, ease: easeCinematic };

  return (
    <main
      className="relative grid h-[100dvh] place-items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 36%, #262019 0%, #171209 48%, #0c0906 100%)",
      }}
    >
      {/* the room warms once the invitation is out */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, #3d3323 0%, #241c11 55%, #120d08 100%)",
        }}
        initial={false}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 2, ease: "easeInOut" }}
      />

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

      {/* stage — entrance fade, then float while sealed */}
      <motion.div
        className="relative"
        style={{ width: "min(85vw, 420px)" }}
        initial={{ opacity: 0, y: 26, scale: 0.965 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 2.4, delay: 0.5, ease: easeOutLong }}
      >
        <motion.div
          className="relative"
          animate={
            sealed && !reduced
              ? { y: [0, -9, 0], rotate: [0, 0.45, 0, -0.35, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={
            sealed && !reduced
              ? { duration: 9, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.8, ease: "easeOut" }
          }
          style={{ aspectRatio: "7 / 5", perspective: 1400 }}
        >
          {/* interior back wall */}
          <motion.div
            className="absolute inset-0 z-0"
            initial={false}
            animate={envelopeExit}
            transition={exitTransition}
          >
            <EnvelopeBase />
          </motion.div>

          {/* the invitation card */}
          <motion.div
            className="absolute z-20"
            style={{ left: "6%", width: "88%", top: "7%", height: "86%" }}
            initial={false}
            animate={
              done
                ? { y: "0%", scale: 1.12 }
                : cardOut
                  ? { y: "-58%", scale: 1 }
                  : { y: "0%", scale: 1 }
            }
            transition={{ duration: reduced ? 0 : done ? 1.4 : 1.2, ease: easeCinematic }}
          >
            <InvitationCard />
          </motion.div>

          {/* front pocket */}
          <motion.div
            className="absolute inset-0 z-30"
            style={{ filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.45))" }}
            initial={false}
            animate={envelopeExit}
            transition={exitTransition}
          >
            <EnvelopePocket />
          </motion.div>

          {/* top flap — hinged at the top edge, rotates up and over */}
          <motion.div
            className="absolute left-0 top-0 w-full"
            style={{
              height: "67%",
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              zIndex: flapOpen ? 10 : 40,
            }}
            initial={false}
            animate={{
              rotateX: flapOpen ? -172 : 0,
              opacity: done ? 0 : 1,
              y: done ? 60 : 0,
            }}
            transition={{
              rotateX: { duration: reduced ? 0 : 1.1, ease: easeCinematic },
              ...exitTransition,
            }}
          >
            <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
              <TopFlap face="outer" />
            </div>
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
            >
              <TopFlap face="inner" />
            </div>
          </motion.div>

          {/* wax seal, above everything */}
          <Seal
            cracked={stage !== "sealed"}
            onOpen={open}
            className="absolute z-50 block"
            style={{
              width: "43%",
              left: "50%",
              top: "62.6%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </motion.div>

        {/* contact shadow on the floor beneath */}
        <motion.div
          aria-hidden
          className="absolute -bottom-12 left-1/2 h-7 w-[68%] -translate-x-1/2 rounded-[50%] blur-xl"
          style={{ background: "rgba(0,0,0,0.55)" }}
          initial={{ opacity: 0 }}
          animate={
            done
              ? { opacity: 0 }
              : reduced || !sealed
                ? { opacity: 0.5 }
                : { opacity: [0.55, 0.4, 0.55], scaleX: [1, 0.94, 1] }
          }
          transition={
            reduced || !sealed
              ? { duration: 0.8 }
              : { duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
          }
        />

        {/* whispered affordance */}
        <motion.p
          className="pointer-events-none absolute -bottom-24 left-0 right-0 text-center text-[10px] font-light uppercase"
          style={{ letterSpacing: "0.4em", color: "#c8b78e", fontFamily: "var(--font-sans)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: sealed ? 0.55 : 0 }}
          transition={{ duration: 1.6, delay: sealed ? 3.5 : 0, ease: "easeInOut" }}
        >
          touch the seal
        </motion.p>
      </motion.div>
    </main>
  );
}
