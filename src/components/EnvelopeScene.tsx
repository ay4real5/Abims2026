"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import EnvelopePocket from "./envelope/EnvelopePocket";
import TopFlap from "./envelope/TopFlap";
import Seal from "./envelope/Seal";
import Website from "./Website";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const easeCinematic: [number, number, number, number] = [0.45, 0, 0.15, 1];
const POINT = "58dvh";

/**
 * A short intro gate: a sealed envelope. Tap the seal → it opens → we fade
 * into the wedding website. That's the whole intro.
 *
 * sealed  – envelope, seal breathing
 * opening – seal cracks, flap lifts        (tap → +0 ms)
 * done    – envelope fades, website shown   (+1600 ms)
 */
type Stage = "sealed" | "opening" | "done";

export default function EnvelopeScene() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("sealed");
  const [visited, setVisited] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (localStorage.getItem("abims-opened")) setVisited(true);
  }, []);
  useEffect(() => {
    if (stage === "done") localStorage.setItem("abims-opened", "1");
  }, [stage]);

  // dev shortcut: /?open shows the website directly
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("open")) setStage("done");
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (stage !== "sealed") return;
    try {
      navigator.vibrate?.(12);
    } catch {}
    if (reduced) {
      setStage("done");
      return;
    }
    setStage("opening");
    timers.current = [setTimeout(() => setStage("done"), 1600)];
  }, [stage, reduced]);

  const sealed = stage === "sealed";
  const opening = stage === "opening";
  const done = stage === "done";

  return (
    <main className="relative min-h-[100dvh]" style={{ perspective: 1200 }}>
      {/* the website underneath */}
      {done && <Website />}

      {/* the envelope intro gate */}
      {!done && (
          <motion.div
            className="fixed inset-0 z-50 h-[100dvh] overflow-hidden"
          >
            {/* folds */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-30"
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.9, ease: easeCinematic, delay: 0.3 }}
            >
              <EnvelopePocket />
              <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px" }} />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(120% 60% at 50% 0%, rgba(255,252,242,0.5) 0%, rgba(255,252,242,0) 55%)",
                  mixBlendMode: "soft-light",
                }}
              />
            </motion.div>

            {/* top flap */}
            <motion.div
              className="pointer-events-none absolute left-0 top-0 w-full"
              style={{ height: POINT, transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: opening ? 20 : 40 }}
              animate={{ rotateX: opening ? -168 : 0, opacity: opening ? 0 : 1 }}
              transition={{ rotateX: { duration: 1.1, ease: [0.55, 0, 0.2, 1] }, opacity: { duration: 0.8, ease: easeCinematic, delay: 0.4 } }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", filter: "drop-shadow(0 10px 18px rgba(90,68,38,0.28))" }}>
                <TopFlap face="outer" />
                <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}>
                <TopFlap face="inner" />
              </div>
            </motion.div>

            {/* seal */}
            <motion.div
              className="absolute z-50"
              style={{ left: "50%", top: POINT, width: "min(38vw, 190px)", x: "-50%", y: "-50%" }}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Seal cracked={!sealed} onOpen={open} className="block w-full" />
            </motion.div>

            {/* tap hint */}
            <motion.div
              className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 text-center"
              style={{ top: `calc(${POINT} + min(22vw, 110px))` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: sealed ? 1 : 0 }}
              transition={{ duration: 1.2, delay: sealed ? 1.8 : 0 }}
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
              <p className="mt-2 text-[9px] font-light uppercase" style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.4em", color: "#8a7a63" }}>
                tap to open
              </p>
            </motion.div>

            {/* returning guests: skip straight in */}
            {sealed && visited && (
              <motion.button
                onClick={() => setStage("done")}
                className="absolute bottom-7 left-1/2 z-[60] -translate-x-1/2 text-[9px] font-light uppercase underline underline-offset-4"
                style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.35em", color: "#8a7a63" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1, delay: 1.2 }}
              >
                skip intro
              </motion.button>
            )}
          </motion.div>
        )}
    </main>
  );
}
