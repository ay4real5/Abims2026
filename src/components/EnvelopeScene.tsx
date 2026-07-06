"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import EnvelopePocket from "./envelope/EnvelopePocket";
import TopFlap from "./envelope/TopFlap";
import Seal from "./envelope/Seal";
import Experience from "./experience/Experience";
import MagicReveal from "./MagicReveal";
import { playChime } from "@/lib/chime";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const easeCinematic: [number, number, number, number] = [0.45, 0, 0.15, 1];

/** flap point sits at 58% of the viewport height */
const POINT = "58dvh";

/**
 * sealed  – fullscreen envelope, seal breathing, tap hint pulsing
 * cracked – wax shatters dramatically              (tap → +0 ms)
 * opening – flap lifts slowly, light builds        (+900 ms)
 * portal  – burst; camera flies through the mouth  (+2200 ms)
 * settled – inside the living experience           (+3800 ms)
 */
type Stage = "sealed" | "cracked" | "opening" | "portal" | "settled";

export default function EnvelopeScene() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("sealed");
  const [visited, setVisited] = useState(false);
  const [instant, setInstant] = useState(false); // deep-link / reduced motion → no entrance
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // returning guests may skip straight to the experience
  useEffect(() => {
    if (localStorage.getItem("abims-opened")) setVisited(true);
  }, []);
  useEffect(() => {
    if (stage === "settled") localStorage.setItem("abims-opened", "1");
  }, [stage]);

  // dev shortcuts: /?open or /?stage=opening
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("open")) {
      setStage("settled");
      setInstant(true);
    }
    const s = params.get("stage");
    if (s === "cracked" || s === "opening" || s === "portal" || s === "settled") {
      setStage(s);
      if (s === "portal" || s === "settled") setInstant(true);
    }
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (stage !== "sealed") return;
    try {
      navigator.vibrate?.([10, 40, 18]);
    } catch {}
    if (reduced) {
      setStage("settled");
      return;
    }
    setStage("cracked");
    timers.current = [
      setTimeout(() => setStage("opening"), 900),
      setTimeout(() => {
        setStage("portal");
        playChime();
      }, 2200),
      setTimeout(() => setStage("settled"), 3800),
    ];
  }, [stage, reduced]);

  const sealed = stage === "sealed";
  const flapOpen = stage === "opening" || stage === "portal" || stage === "settled";
  const portal = stage === "portal" || stage === "settled";
  const settled = stage === "settled";
  const burst = stage === "portal";

  const foldExit = portal ? { opacity: 0 } : { opacity: 1 };
  const exitTransition = { duration: reduced ? 0 : 1.0, ease: easeCinematic };

  // during the portal, the whole envelope zooms up and past the camera
  const envelopeZoom = portal
    ? { scale: reduced ? 1 : 7, opacity: 0 }
    : stage === "opening"
      ? { scale: 1.05, opacity: 1 }
      : { scale: 1, opacity: 1 };

  return (
    <main className="relative h-[100dvh] overflow-hidden" style={{ perspective: 1200 }}>
      {/* ─ the living experience, revealed as we fly through ─ */}
      {portal && (
        <motion.div
          className="fixed inset-0 z-0"
          initial={instant || reduced ? false : { opacity: 0, scale: 1.14, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: instant || reduced ? 0 : 1.8, ease: easeCinematic }}
        >
          <Experience />
        </motion.div>
      )}

      {/* ─ the burst at the portal moment ─ */}
      {burst && <MagicReveal />}

      {/* ─ everything that zooms through the camera ─ */}
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: "50% 52%", pointerEvents: portal ? "none" : "auto" }}
        initial={false}
        animate={envelopeZoom}
        transition={{ duration: reduced ? 0 : 1.6, ease: [0.5, 0, 0.2, 1] }}
      >
        {/* ── envelope folds ─────────────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          initial={false}
          animate={foldExit}
          transition={exitTransition}
        >
          <EnvelopePocket />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px" }}
          />
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

        {/* light pooling at the opening as the flap lifts */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            top: "56dvh",
            width: "70vmin",
            height: "70vmin",
            background:
              "radial-gradient(closest-side, rgba(255,238,190,0.7), rgba(255,238,190,0) 70%)",
          }}
          initial={false}
          animate={{ opacity: flapOpen && !portal ? 1 : 0, scale: flapOpen ? 1.1 : 0.6 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* ── top flap — hinged at the very top of the screen ─────── */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 w-full"
          style={{
            height: POINT,
            transformOrigin: "50% 0%",
            transformStyle: "preserve-3d",
            zIndex: flapOpen ? 20 : 40,
          }}
          initial={false}
          animate={{ rotateX: flapOpen ? -170 : 0, opacity: portal ? 0 : 1 }}
          transition={{
            rotateX: { duration: reduced ? 0 : 1.3, ease: [0.55, 0, 0.2, 1] },
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

        {/* ── wax seal at the flap point ──────────────────────────── */}
        <motion.div
          className="absolute z-50"
          style={{ left: "50%", top: POINT, width: "min(38vw, 190px)", x: "-50%", y: "-50%" }}
          initial={false}
          animate={{ opacity: stage === "opening" || portal ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Seal cracked={stage !== "sealed"} onOpen={open} className="block w-full" />
        </motion.div>

        {/* ── tap hint below the seal ─────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 text-center"
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
            <path d="M12 3v8" />
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

      {/* returning guests: skip straight to the experience */}
      {sealed && visited && (
        <motion.button
          onClick={() => {
            setStage("portal");
            playChime();
            timers.current.push(setTimeout(() => setStage("settled"), 1200));
          }}
          className="fixed bottom-7 left-1/2 z-[60] -translate-x-1/2 text-[9px] font-light uppercase underline underline-offset-4"
          style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.35em", color: "#8a7a63" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          skip intro
        </motion.button>
      )}
    </main>
  );
}
