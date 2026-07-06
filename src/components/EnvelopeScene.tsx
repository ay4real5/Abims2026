"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import EnvelopePocket from "./envelope/EnvelopePocket";
import TopFlap from "./envelope/TopFlap";
import Seal from "./envelope/Seal";
import InvitationSheet from "./InvitationSheet";
import MagicReveal from "./MagicReveal";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const easeCinematic: [number, number, number, number] = [0.45, 0, 0.15, 1];

/** flap point sits at 58% of the viewport height */
const POINT = "58dvh";

/**
 * sealed  – fullscreen envelope, seal breathing, tap hint pulsing
 * cracked – wax fractures                          (tap → +0 ms)
 * opening – flap rotates up in 3D, page beneath    (+650 ms)
 * settled – folds fade away, page unlocks          (+1900 ms)
 */
type Stage = "sealed" | "cracked" | "opening" | "settled";

export default function EnvelopeScene() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("sealed");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // dev shortcuts: /?open or /?stage=opening
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("open")) setStage("settled");
    const s = params.get("stage");
    if (s === "cracked" || s === "opening" || s === "settled") setStage(s);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (stage !== "sealed") return;
    try {
      navigator.vibrate?.(12);
    } catch {}
    if (reduced) {
      setStage("settled");
      return;
    }
    setStage("cracked");
    timers.current = [
      setTimeout(() => setStage("opening"), 1100),
      setTimeout(() => setStage("settled"), 3600),
    ];
  }, [stage, reduced]);

  const sealed = stage === "sealed";
  const flapOpen = stage === "opening" || stage === "settled";
  const settled = stage === "settled";

  const foldExit = settled ? { opacity: 0 } : { opacity: 1 };
  const exitTransition = { duration: reduced ? 0 : 1.2, ease: easeCinematic, delay: reduced ? 0 : 0.1 };

  return (
    <main className="relative h-[100dvh] overflow-hidden" style={{ perspective: 1200 }}>
      {/* gentle camera push-in while everything moves in slow motion */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: stage === "opening" ? 1.04 : 1 }}
        transition={{ duration: reduced ? 0 : 2.6, ease: [0.3, 0, 0.2, 1] }}
      >
      {/* the invitation lives underneath everything */}
      <InvitationSheet active={settled} />

      {/* golden sparkle burst while the invitation appears */}
      {flapOpen && <MagicReveal />}

      {/* ── envelope folds (fade away once open) ─────────────────── */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        initial={false}
        animate={foldExit}
        transition={exitTransition}
      >
        <EnvelopePocket />
        {/* cotton grain over the folds */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px" }}
        />
        {/* soft top light */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 60% at 50% 0%, rgba(255,252,242,0.5) 0%, rgba(255,252,242,0) 55%)",
            mixBlendMode: "soft-light",
          }}
        />
      </motion.div>

      {/* ── top flap — hinged at the very top of the screen ──────── */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-40 w-full"
        style={{
          height: POINT,
          transformOrigin: "50% 0%",
          transformStyle: "preserve-3d",
          zIndex: flapOpen ? 20 : 40,
        }}
        initial={false}
        animate={{ rotateX: flapOpen ? -168 : 0, opacity: settled ? 0 : 1 }}
        transition={{
          rotateX: { duration: reduced ? 0 : 2.4, ease: [0.55, 0, 0.2, 1] },
          opacity: exitTransition,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            filter: "drop-shadow(0 10px 18px rgba(90,68,38,0.28))",
          }}
        >
          <TopFlap face="outer" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("${NOISE}")`,
              backgroundSize: "180px",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
        >
          <TopFlap face="inner" />
        </div>
      </motion.div>

      {/* ── wax seal at the flap point ────────────────────────────── */}
      <motion.div
        className="fixed z-50"
        style={{
          left: "50%",
          top: POINT,
          width: "min(38vw, 190px)",
          x: "-50%",
          y: "-50%",
        }}
        initial={false}
        animate={{ opacity: stage === "opening" || settled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Seal cracked={stage !== "sealed"} onOpen={open} className="block w-full" />
      </motion.div>

      {/* ── tap hint below the seal ───────────────────────────────── */}
      <motion.div
        className="pointer-events-none fixed left-1/2 z-50 -translate-x-1/2 text-center"
        style={{ top: `calc(${POINT} + min(22vw, 110px))` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: sealed ? 1 : 0 }}
        transition={{ duration: 1.2, delay: sealed ? 2.2 : 0 }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="mx-auto h-7 w-7"
          fill="none"
          stroke="#8a7a63"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={reduced ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          {/* pointing hand */}
          <path d="M12 3v8" />
          <path d="M12 11l0 5" opacity="0" />
          <path d="M9.5 10.5V6a1.5 1.5 0 0 1 3 0v4" opacity="0" />
          <path d="M12 11c0-1 .7-1.8 1.6-1.8s1.6.8 1.6 1.8v1c0 .5.4.8.9.6l1.2-.5c.9-.4 1.9.1 2.1 1.1l.4 2.2c.4 2.4-1.4 4.6-3.8 4.6h-3.4c-1.3 0-2.5-.6-3.2-1.7l-3-4.4c-.5-.7-.3-1.7.5-2.1.6-.3 1.4-.2 1.9.4l1.2 1.3" />
        </motion.svg>
        <p
          className="mt-2 text-[9px] font-light uppercase"
          style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.4em", color: "#8a7a63" }}
        >
          tap the seal
        </p>
      </motion.div>
      </motion.div>
    </main>
  );
}
