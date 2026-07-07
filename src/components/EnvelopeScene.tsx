"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import EnvelopePocket from "./envelope/EnvelopePocket";
import TopFlap from "./envelope/TopFlap";
import Seal from "./envelope/Seal";
import Website from "./Website";
import { site } from "@/config/site";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const easeCinematic: [number, number, number, number] = [0.45, 0, 0.15, 1];
const easeOutSoft: [number, number, number, number] = [0.16, 1, 0.3, 1];
const POINT = "58dvh";
const scriptFont = { fontFamily: "var(--font-script), cursive" };
const sans = { fontFamily: "var(--font-sans)" };
const serif = { fontFamily: "var(--font-serif)" };

/**
 * The intro: a sealed envelope, and a cinematic unveiling when it's opened.
 *
 * sealed    – envelope, the wax seal breathing            (tap → next)
 * opening   – seal shatters in a burst of gold; flap lifts slowly  (+0ms)
 * emerging  – the invitation card rises out of the envelope        (+1200ms)
 * immersing – golden light blooms, the camera pushes through       (+2600ms)
 * done      – we arrive on the website                             (+4000ms)
 */
type Stage = "sealed" | "opening" | "emerging" | "immersing" | "done";

/* rising motes of gold light */
const MOTES = [
  { x: 12, s: 7, delay: 0, dur: 3.6, drift: -28 },
  { x: 22, s: 4, delay: 0.25, dur: 4.4, drift: 22 },
  { x: 31, s: 6, delay: 0.5, dur: 4.0, drift: -16 },
  { x: 42, s: 5, delay: 0.15, dur: 3.4, drift: 18 },
  { x: 52, s: 8, delay: 0.7, dur: 4.3, drift: -24 },
  { x: 63, s: 5, delay: 0.35, dur: 3.5, drift: 26 },
  { x: 76, s: 7, delay: 0.55, dur: 4.6, drift: -18 },
  { x: 88, s: 4, delay: 0.85, dur: 3.9, drift: 20 },
  { x: 18, s: 3, delay: 1.1, dur: 4.2, drift: 34 },
  { x: 70, s: 3, delay: 1.25, dur: 3.8, drift: -30 },
  { x: 48, s: 4, delay: 1.45, dur: 4.8, drift: 12 },
  { x: 84, s: 6, delay: 1.65, dur: 4.1, drift: -22 },
];

const DUST = Array.from({ length: 42 }, (_, i) => {
  const angle = (i / 42) * Math.PI * 2 + (i % 5) * 0.18;
  const radius = 70 + (i % 9) * 24;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.62, s: 2 + (i % 5) * 1.5, delay: (i % 8) * 0.035, dur: 1.1 + (i % 6) * 0.12 };
});

const BURST = Array.from({ length: 88 }, (_, i) => {
  const ang = (i / 88) * Math.PI * 2 + (i % 4) * 0.16;
  const wave = i % 3;
  const dist = 180 + wave * 130 + (i % 7) * 38;
  return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, s: 7 + (i % 5) * 7, delay: wave * 0.08 + (i % 9) * 0.018, spin: (i % 2 ? 1 : -1) * (120 + (i % 6) * 40) };
});

function Motes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: `${m.x}%`, bottom: "14%", width: m.s, height: m.s, background: "radial-gradient(circle, #fff7d8, #f6cf75 42%, rgba(255,233,168,0) 72%)", filter: "blur(0.4px)", boxShadow: "0 0 18px rgba(244,198,96,0.65)" }}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], y: [0, -300], x: [0, m.drift], scale: [0.5, 1.4, 0.3] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function MagicDustField({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[44] overflow-hidden">
      {DUST.map((p, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 rounded-full top-[58dvh]"
          style={{ width: p.s, height: p.s, background: i % 4 === 0 ? "#ffffff" : "#f3c96d", boxShadow: "0 0 14px rgba(255,224,145,0.95)" }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: [0, 1.7, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function SealShockwave({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 z-[45] -translate-x-1/2 -translate-y-1/2" style={{ top: POINT }}>
      {[0, 1, 2, 3].map((k) => (
        <motion.div
          key={k}
          className="absolute rounded-full"
          style={{ left: -70, top: -70, width: 140, height: 140, border: "1px solid rgba(255,235,176,0.9)", boxShadow: "0 0 28px rgba(255,219,128,0.55)" }}
          initial={{ opacity: 0.95, scale: 0.2 }}
          animate={{ opacity: 0, scale: 4.8 + k * 1.2 }}
          transition={{ duration: 1.25, delay: k * 0.14, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function CinematicVignette({ sealed, opening, emerging, immersing }: { sealed: boolean; opening: boolean; emerging: boolean; immersing: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[34]"
      style={{ background: "radial-gradient(circle at 50% 50%, transparent 18%, rgba(50,30,8,0.24) 48%, rgba(18,10,2,0.72) 100%)" }}
      animate={{ opacity: immersing ? [0.55, 0.15, 0] : emerging ? 0.42 : opening ? [0.12, 0.62, 0.48] : sealed ? 0.08 : 0.2 }}
      transition={{ duration: immersing ? 1.8 : 1.2, ease: "easeInOut" }}
    />
  );
}

/* the golden bloom that grows behind the card and floods on the way through */
function LightBloom({ emerging, immersing }: { emerging: boolean; immersing: boolean }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[32] h-[86vmin] w-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,250,230,1) 0%, rgba(255,225,142,0.68) 32%, rgba(255,205,103,0.2) 54%, rgba(255,226,150,0) 72%)", mixBlendMode: "screen" }}
        initial={{ opacity: 0, scale: 0.18 }}
        animate={immersing ? { opacity: [0.95, 1, 0.15], scale: [1.2, 4.8, 8] } : emerging ? { opacity: [0, 0.9, 0.72], scale: [0.28, 1.2, 1.55] } : { opacity: 0, scale: 0.18 }}
        transition={{ duration: immersing ? 1.9 : 1.55, ease: immersing ? "easeIn" : easeOutSoft }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[33] h-[140vmin] w-[140vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "conic-gradient(from 20deg, rgba(255,255,255,0), rgba(255,224,143,0.26), rgba(255,255,255,0), rgba(245,191,83,0.22), rgba(255,255,255,0))", mixBlendMode: "screen", filter: "blur(2px)" }}
        initial={{ opacity: 0, rotate: 0, scale: 0.55 }}
        animate={immersing ? { opacity: [0.35, 0.85, 0], rotate: 120, scale: 2.4 } : emerging ? { opacity: 0.35, rotate: 35, scale: 1 } : { opacity: 0, rotate: 0, scale: 0.55 }}
        transition={{ duration: immersing ? 2 : 1.6, ease: "easeInOut" }}
      />
    </>
  );
}

/* the invitation card that rises out of the envelope */
function InvitationCard({ emerging, immersing }: { emerging: boolean; immersing: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[38] flex items-center justify-center px-8" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        className="relative w-[min(82vw,360px)] overflow-hidden rounded-[16px] px-8 py-12 text-center"
        style={{ background: "linear-gradient(158deg,#fffaf0 0%,#f5e8ca 54%,#ead6a8 100%)", boxShadow: immersing ? "0 58px 130px rgba(58,38,12,0.58), 0 0 90px rgba(255,215,128,0.62)" : "0 42px 98px rgba(58,38,12,0.54), 0 0 42px rgba(255,215,128,0.34)", transformOrigin: "50% 100%" }}
        initial={{ y: 230, opacity: 0, scale: 0.72, rotateX: 34, rotateZ: -1.2 }}
        animate={immersing ? { y: [-10, -24, -42], opacity: [1, 0.78, 0], scale: [1.02, 0.94, 0.82], rotateX: [0, 2, 0], rotateZ: 0 } : emerging ? { y: [180, 18, -10], opacity: [0, 1, 1], scale: [0.78, 1.05, 1], rotateX: [32, -4, 0], rotateZ: [-1.2, 0.8, 0] } : { y: 230, opacity: 0, scale: 0.72, rotateX: 34, rotateZ: -1.2 }}
        transition={{ duration: immersing ? 3.05 : 1.65, ease: easeOutSoft }}
      >
        {/* grain + gold frame */}
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px" }} />
        <div className="absolute inset-[10px] rounded-[9px]" style={{ border: "1px solid rgba(169,138,82,0.7)" }} />
        <div className="absolute inset-[14px] rounded-[6px]" style={{ border: "1px solid rgba(169,138,82,0.3)" }} />
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-1/2 skew-x-[-18deg]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)", filter: "blur(1px)" }}
          initial={{ x: "-150%" }}
          animate={{ x: immersing ? "280%" : "240%" }}
          transition={{ duration: 1.2, delay: 0.45, ease: "easeInOut" }}
        />

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: emerging ? 0.45 : 0, duration: 1, ease: easeOutSoft }}>
          <motion.p className="text-6xl leading-none" style={{ ...scriptFont, color: "#a9843f", textShadow: "0 0 24px rgba(255,218,141,0.46)" }} animate={immersing ? { scale: [1, 1.03, 0.98] } : { scale: 1 }} transition={{ duration: 2.2, ease: "easeInOut" }}>
            {site.initials[0]}<span className="text-4xl">&amp;</span>{site.initials[1]}
          </motion.p>
          <div className="mx-auto mt-6 flex w-28 items-center gap-2">
            <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.58)" }} />
            <span style={{ color: "#a9843f" }}>&#10022;</span>
            <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.58)" }} />
          </div>
          <motion.p className="mt-6 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.46em", color: "#96733a" }} initial={{ opacity: 0, letterSpacing: "0.7em" }} animate={{ opacity: 1, letterSpacing: "0.46em" }} transition={{ delay: 0.7, duration: 1.1, ease: easeOutSoft }}>You are invited</motion.p>
          <p className="mt-4 text-4xl italic leading-tight" style={{ ...serif, color: "#463726" }}>{site.coupleNames}</p>
          <p className="mt-5 text-[10px] font-light uppercase" style={{ ...sans, letterSpacing: "0.32em", color: "#8a7a63" }}>{site.dateLine}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* spinning god-rays that flood out of the centre */
function GodRays({ immersing }: { immersing: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[31]"
      style={{
        background: "repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,232,170,0) 0deg, rgba(255,232,170,0.42) 2.5deg, rgba(255,232,170,0) 6.5deg, rgba(255,255,255,0.18) 8deg, rgba(255,232,170,0) 11deg)",
        WebkitMaskImage: "radial-gradient(circle at 50% 48%, #000 2%, transparent 74%)",
        maskImage: "radial-gradient(circle at 50% 48%, #000 2%, transparent 74%)",
        mixBlendMode: "screen",
        filter: "blur(0.4px)",
      }}
      initial={{ opacity: 0, rotate: 0, scale: 0.7 }}
      animate={immersing ? { opacity: [0.5, 1, 0.25], rotate: 95, scale: 3.1 } : { opacity: 0.52, rotate: 24, scale: 1.18 }}
      transition={{ duration: immersing ? 1.9 : 2.4, ease: "easeInOut" }}
    />
  );
}

function PortalBloom({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[43]"
      style={{ background: "radial-gradient(circle at 50% 46%, #ffffff 0%, #fff7de 26%, rgba(255,218,130,0.82) 48%, rgba(255,242,207,0) 82%)", mixBlendMode: "screen" }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.42, 0.2, 0], scale: [0.9, 1.35, 2.05, 2.8] }}
      transition={{ duration: 3.1, ease: "easeInOut", times: [0, 0.34, 0.72, 1] }}
    />
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ filter: "drop-shadow(0 0 8px rgba(255,221,145,0.98))" }} aria-hidden>
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#fff1c9" />
    </svg>
  );
}

function SparkleBurst() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[42] flex items-center justify-center overflow-hidden">
      <div className="relative">
        {BURST.map((b, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: 0, top: 0 }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], x: b.x, y: b.y, scale: [0, 1.8, 0.25], rotate: b.spin }}
            transition={{ duration: 1.55, delay: b.delay, ease: "easeOut" }}
          >
            <Star size={b.s} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function EnvelopeScene() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("sealed");
  const [visited, setVisited] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [mobile, setMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const openingStarted = useRef(false);

  const startMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a || !site.music.src) return;
    a.volume = 0;
    a.play()
      .then(() => {
        setMusicOn(true);
        const target = 0.5;
        const id = setInterval(() => {
          if (!audioRef.current) return clearInterval(id);
          audioRef.current.volume = Math.min(target, audioRef.current.volume + 0.04);
          if (audioRef.current.volume >= target) clearInterval(id);
        }, 120);
      })
      .catch(() => {});
  }, []);

  const toggleMusic = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.volume = 0.5;
      a.play().then(() => setMusicOn(true)).catch(() => {});
    } else {
      a.pause();
      setMusicOn(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("abims-opened")) setVisited(true);
  }, []);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (stage === "done") localStorage.setItem("abims-opened", "1");
  }, [stage]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("open")) setStage("done");
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (openingStarted.current || stage !== "sealed") return;
    openingStarted.current = true;
    try {
      navigator.vibrate?.([10, 40, 18]);
    } catch {}
    startMusic();
    if (reduced) {
      setStage("done");
      return;
    }
    setStage("opening");
    timers.current = [
      setTimeout(() => setStage("emerging"), 1600),
      setTimeout(() => setStage("immersing"), 3600),
      setTimeout(() => setStage("done"), 7000),
    ];
  }, [stage, reduced, startMusic]);

  const skipIn = useCallback(() => {
    openingStarted.current = true;
    startMusic();
    setStage("done");
  }, [startMusic]);

  const sealed = stage === "sealed";
  const opening = stage === "opening";
  const emerging = stage === "emerging";
  const immersing = stage === "immersing";
  const done = stage === "done";
  const opened = !sealed; // flap/seal open through every post-tap stage
  const revealing = emerging || immersing; // card, bloom, motes
  const compact = mobile;

  return (
    <main className="relative min-h-[100dvh]">
      {/* the website — begins warming up behind the light before we arrive */}
      {(revealing || done) && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={reduced ? undefined : { opacity: 1 }}
          transition={{ duration: 2.45, ease: easeOutSoft }}
        >
          <Website />
        </motion.div>
      )}

      {/* the envelope intro gate — perspective lives here so it doesn't
          trap the website's fixed-position modals inside <main> */}
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 h-[100dvh] overflow-hidden"
          style={{ perspective: 1400, cursor: sealed ? "pointer" : "default" }}
          onPointerUp={sealed ? open : undefined}
          animate={
            immersing
              ? { scale: [1.18, 1.08, 0.98, 0.94], opacity: [1, 0.82, 0.38, 0], x: 0, y: [0, -8, -18, -24], rotateZ: 0 }
              : opened
                ? { scale: 1.22, opacity: 1, rotateZ: 0 }
                : { scale: 1, opacity: 1, rotateZ: 0 }
          }
          transition={immersing ? { duration: 3.25, ease: [0.16, 1, 0.3, 1] } : { duration: 2.9, ease: "easeInOut" }}
        >
          {/* backing wash so the website doesn't show through before the bloom */}
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{ background: "radial-gradient(120% 90% at 50% 42%, #f6ecd6 0%, #efe3c8 55%, #e6d7b6 100%)" }}
            animate={{ opacity: immersing ? 0 : opening ? [1, 0.82, 1] : 1, scale: opening ? [1, 1.035, 1] : 1 }}
            transition={{ duration: opening ? 1.3 : 1.1, ease: "easeInOut" }}
          />

          {/* folds */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            animate={{ opacity: opened ? 0 : 1, scale: opening ? [1, 1.025, 1] : 1 }}
            transition={{ duration: 1.25, ease: easeCinematic, delay: opened ? 0.45 : 0 }}
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

          {/* the invitation card + light + motes + rays + vignette */}
          <CinematicVignette sealed={sealed} opening={opening} emerging={emerging} immersing={immersing} />
          <MagicDustField active={opening && !compact} />
          <SealShockwave active={opening && !compact} />
          {revealing && (
            <>
              <GodRays immersing={immersing} />
              <LightBloom emerging={emerging} immersing={immersing} />
              <PortalBloom active={immersing} />
              <InvitationCard emerging={emerging} immersing={immersing} />
              {!compact && <Motes />}
            </>
          )}

          {/* the climax: shockwaves + a burst of sparkles + a flash of light */}
          {immersing && (
            <>
              {(compact ? [0, 1] : [0, 1, 2, 3]).map((k) => (
                <motion.div
                  key={k}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 z-[41] rounded-full"
                  style={{ width: 170, height: 170, marginLeft: -85, marginTop: -85, border: "1px solid rgba(255,233,175,0.38)", boxShadow: "0 0 24px rgba(255,219,128,0.22)" }}
                  initial={{ scale: 0.4, opacity: 0.34 }}
                  animate={{ scale: 7 + k * 0.85, opacity: 0 }}
                  transition={{ duration: 2.7, delay: k * 0.18, ease: "easeOut" }}
                />
              ))}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[44]"
                style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.46) 0%, rgba(255,242,207,0.24) 38%, rgba(255,242,207,0) 78%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.32, 0.18, 0] }}
                transition={{ duration: 3.05, ease: "easeInOut", times: [0, 0.34, 0.72, 1] }}
              />
            </>
          )}

          {/* a bright burst of light at the moment the seal breaks */}
          {opening && (
            <>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute left-1/2 z-[45] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ top: POINT, width: "64vmin", height: "64vmin", background: "radial-gradient(circle, rgba(255,244,210,0.95), rgba(255,240,200,0) 68%)", mixBlendMode: "screen" }}
                initial={{ opacity: 0, scale: 0.35 }}
                animate={{ opacity: [0, 1, 0.6, 0], scale: [0.25, 1.45, 2.6, 3.2] }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              />
              {(compact ? [0] : [0, 1, 2]).map((k) => (
                <motion.div
                  key={k}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 z-[45] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ top: POINT, width: 130, height: 130, marginLeft: 0, border: "2px solid rgba(255,236,180,0.9)", boxShadow: "0 0 28px rgba(255,225,145,0.6)" }}
                  initial={{ scale: 0, opacity: 0.95 }}
                  animate={{ scale: 5.8 + k * 0.9, opacity: 0 }}
                  transition={{ duration: 1.35, delay: k * 0.16, ease: "easeOut" }}
                />
              ))}
            </>
          )}

          {/* top flap */}
          <motion.div
            className="pointer-events-none absolute left-0 top-0 w-full"
            style={{ height: POINT, transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: opened ? 20 : 40 }}
            animate={{ rotateX: opened ? -176 : 0, opacity: opened ? 0 : 1, y: opened ? -22 : 0 }}
            transition={{ rotateX: { duration: 1.55, ease: [0.55, 0, 0.2, 1] }, opacity: { duration: 1.15, ease: easeCinematic, delay: 0.55 }, y: { duration: 1.55, ease: easeCinematic } }}
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
            className="absolute z-[46]"
            style={{ left: "50%", top: POINT, width: "min(38vw, 190px)", x: "-50%", y: "-50%" }}
            animate={{ opacity: opened ? 0 : 1, scale: opening ? [1, 1.18, 0.86] : 1, filter: opening ? ["drop-shadow(0 0 0px rgba(255,220,130,0))", "drop-shadow(0 0 26px rgba(255,220,130,0.95))", "drop-shadow(0 0 8px rgba(255,220,130,0.2))"] : "drop-shadow(0 0 0px rgba(255,220,130,0))" }}
            transition={{ duration: opening ? 1.1 : 0.4, ease: "easeOut" }}
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
            <p className="mt-2 text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "#8a7a63" }}>
              tap to open
            </p>
          </motion.div>

          {/* returning guests: skip straight in */}
          {sealed && visited && (
            <motion.button
              onClick={skipIn}
              className="absolute bottom-7 left-1/2 z-[60] -translate-x-1/2 text-[9px] font-light uppercase underline underline-offset-4"
              style={{ ...sans, letterSpacing: "0.35em", color: "#8a7a63" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              skip intro
            </motion.button>
          )}
        </motion.div>
      )}

      {/* background music (plays after the envelope opens) */}
      {site.music.src && <audio ref={audioRef} src={site.music.src} loop preload="none" />}

      {/* floating music toggle, once inside */}
      {done && site.music.src && (
        <motion.button
          onClick={toggleMusic}
          aria-label={musicOn ? "Pause music" : "Play music"}
          title={site.music.title}
          className="fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(250,245,234,0.92)", border: "1px solid rgba(169,138,82,0.45)", boxShadow: "0 6px 18px rgba(120,90,40,0.2)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {musicOn ? (
            <span className="flex items-end gap-[3px]" aria-hidden>
              {[0, 1, 2].map((b) => (
                <motion.span
                  key={b}
                  className="w-[3px] rounded-full"
                  style={{ background: "#8f7340" }}
                  animate={{ height: [6, 15, 6] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: b * 0.18 }}
                />
              ))}
            </span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8f7340" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18V6l10-2v12" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="16" cy="16" r="3" />
              <path d="M3 3l18 18" stroke="#b4562f" />
            </svg>
          )}
        </motion.button>
      )}
    </main>
  );
}
