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
  { x: 18, s: 5, delay: 0, dur: 3.4, drift: -20 },
  { x: 30, s: 3, delay: 0.5, dur: 4.2, drift: 14 },
  { x: 44, s: 6, delay: 0.2, dur: 3.0, drift: -10 },
  { x: 52, s: 4, delay: 0.8, dur: 3.8, drift: 18 },
  { x: 63, s: 5, delay: 0.35, dur: 3.3, drift: -16 },
  { x: 72, s: 3, delay: 0.65, dur: 4.4, drift: 12 },
  { x: 84, s: 6, delay: 0.15, dur: 3.1, drift: -8 },
  { x: 26, s: 4, delay: 1.0, dur: 4.0, drift: 20 },
  { x: 58, s: 3, delay: 1.2, dur: 3.6, drift: -14 },
  { x: 78, s: 5, delay: 0.9, dur: 3.9, drift: 10 },
];

function Motes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: `${m.x}%`, bottom: "18%", width: m.s, height: m.s, background: "radial-gradient(circle, #ffe9a8, rgba(255,233,168,0) 70%)", filter: "blur(0.5px)" }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [0, -220], x: [0, m.drift] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* the golden bloom that grows behind the card and floods on the way through */
function LightBloom({ emerging, immersing }: { emerging: boolean; immersing: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-[32] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(255,241,201,0.95) 0%, rgba(255,226,150,0.55) 35%, rgba(255,226,150,0) 68%)", mixBlendMode: "screen" }}
      initial={{ opacity: 0, scale: 0.25 }}
      animate={immersing ? { opacity: [0.85, 1, 0.9], scale: 5 } : emerging ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0.25 }}
      transition={{ duration: immersing ? 1.4 : 1.1, ease: immersing ? "easeIn" : "easeOut" }}
    />
  );
}

/* the invitation card that rises out of the envelope */
function InvitationCard({ immersing }: { immersing: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[38] flex items-center justify-center px-8" style={{ transformStyle: "preserve-3d" }}>
      <motion.div
        className="relative w-[min(78vw,330px)] overflow-hidden rounded-[12px] px-8 py-11 text-center"
        style={{ background: "linear-gradient(158deg,#fdf7ea 0%,#f3e8cf 60%,#ecdcbb 100%)", boxShadow: "0 40px 90px rgba(58,38,12,0.5), 0 4px 14px rgba(58,38,12,0.3)", transformOrigin: "50% 100%" }}
        initial={{ y: 150, opacity: 0, scale: 0.9, rotateX: 20 }}
        animate={immersing ? { y: -14, opacity: 1, scale: 1.06, rotateX: 0 } : { y: 0, opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: immersing ? 1.4 : 1.25, ease: immersing ? "easeIn" : easeOutSoft }}
      >
        {/* grain + gold frame */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "180px" }} />
        <div className="absolute inset-[10px] rounded-[6px]" style={{ border: "1px solid rgba(169,138,82,0.55)" }} />
        <div className="absolute inset-[13px] rounded-[4px]" style={{ border: "1px solid rgba(169,138,82,0.25)" }} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.9 }}>
          <p className="text-5xl leading-none" style={{ ...scriptFont, color: "#a9843f" }}>
            {site.initials[0]}<span className="text-3xl">&amp;</span>{site.initials[1]}
          </p>
          <div className="mx-auto mt-5 flex w-24 items-center gap-2">
            <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.5)" }} />
            <span style={{ color: "#a9843f" }}>&#10022;</span>
            <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.5)" }} />
          </div>
          <p className="mt-5 text-[10px] font-light uppercase" style={{ ...sans, letterSpacing: "0.42em", color: "#96733a" }}>You are invited</p>
          <p className="mt-4 text-3xl italic leading-tight" style={{ ...serif, color: "#463726" }}>{site.coupleNames}</p>
          <p className="mt-4 text-[10px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}>{site.dateLine}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* a radiating burst of golden sparkle-stars at the moment we go in */
const BURST = Array.from({ length: 46 }, (_, i) => {
  const ang = (i / 46) * Math.PI * 2 + (i % 3) * 0.22;
  const wave = i % 2;
  const dist = (wave ? 300 : 170) + (i % 5) * 46;
  return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, s: 9 + (i % 4) * 8, delay: wave * 0.12 + (i % 5) * 0.03, spin: (i % 2 ? 1 : -1) * 140 };
});

/* spinning god-rays that flood out of the centre */
function GodRays({ immersing }: { immersing: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[31]"
      style={{
        background: "repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,232,170,0) 0deg, rgba(255,232,170,0.3) 3deg, rgba(255,232,170,0) 7deg)",
        WebkitMaskImage: "radial-gradient(circle at 50% 46%, #000 4%, transparent 72%)",
        maskImage: "radial-gradient(circle at 50% 46%, #000 4%, transparent 72%)",
        mixBlendMode: "screen",
      }}
      initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
      animate={immersing ? { opacity: [0.5, 1, 0.85], rotate: 55, scale: 2.2 } : { opacity: 0.45, rotate: 16, scale: 1 }}
      transition={{ duration: immersing ? 1.4 : 2.4, ease: "easeInOut" }}
    />
  );
}

function Star({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" style={{ filter: "drop-shadow(0 0 4px rgba(255,221,145,0.95))" }} aria-hidden>
      <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#fff1c9" />
    </svg>
  );
}

function SparkleBurst() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[40] flex items-center justify-center">
      <div className="relative">
        {BURST.map((b, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: 0, top: 0 }}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], x: b.x, y: b.y, scale: [0, 1.5, 0.5], rotate: b.spin }}
            transition={{ duration: 1.25, delay: b.delay, ease: "easeOut" }}
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

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
    if (stage === "done") localStorage.setItem("abims-opened", "1");
  }, [stage]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("open")) setStage("done");
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (stage !== "sealed") return;
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
      setTimeout(() => setStage("emerging"), 1200),
      setTimeout(() => setStage("immersing"), 2600),
      setTimeout(() => setStage("done"), 4000),
    ];
  }, [stage, reduced, startMusic]);

  const skipIn = useCallback(() => {
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

  return (
    <main className="relative min-h-[100dvh]">
      {/* the website — begins warming up behind the light before we arrive */}
      {(revealing || done) && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, scale: 1.07 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: easeOutSoft }}
        >
          <Website />
        </motion.div>
      )}

      {/* the envelope intro gate — perspective lives here so it doesn't
          trap the website's fixed-position modals inside <main> */}
      {!done && (
        <motion.div
          className="fixed inset-0 z-50 h-[100dvh] overflow-hidden"
          style={{ perspective: 1200 }}
          animate={
            immersing
              ? { scale: 2.3, opacity: 0, x: [0, -8, 7, -6, 4, 0], y: [0, 6, -7, 5, -3, 0] }
              : opened
                ? { scale: 1.14, opacity: 1 }
                : { scale: 1, opacity: 1 }
          }
          transition={immersing ? { duration: 1.5, ease: [0.6, 0, 0.2, 1] } : { duration: 2.6, ease: "easeInOut" }}
        >
          {/* backing wash so the website doesn't show through before the bloom */}
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{ background: "radial-gradient(120% 90% at 50% 42%, #f6ecd6 0%, #efe3c8 55%, #e6d7b6 100%)" }}
            animate={{ opacity: immersing ? 0 : 1 }}
            transition={{ duration: 1.1, ease: "easeIn" }}
          />

          {/* folds */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30"
            animate={{ opacity: opened ? 0 : 1 }}
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

          {/* the invitation card + light + motes + rays + vignette */}
          {revealing && (
            <>
              <GodRays immersing={immersing} />
              <LightBloom emerging={emerging} immersing={immersing} />
              {/* cinematic vignette — darkens to focus, then blows open on the flash */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[33]"
                style={{ background: "radial-gradient(circle at 50% 46%, transparent 26%, rgba(28,17,4,0.6) 100%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: immersing ? [0.6, 0, 0] : 0.5 }}
                transition={{ duration: immersing ? 1.5 : 1.2, ease: "easeIn" }}
              />
              <InvitationCard immersing={immersing} />
              <Motes />
            </>
          )}

          {/* the climax: shockwaves + a burst of sparkles + a flash of light */}
          {immersing && (
            <>
              {[0, 1, 2].map((k) => (
                <motion.div
                  key={k}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 z-[41] rounded-full"
                  style={{ width: 160, height: 160, marginLeft: -80, marginTop: -80, border: "2px solid rgba(255,233,175,0.85)" }}
                  initial={{ scale: 0, opacity: 0.9 }}
                  animate={{ scale: 9, opacity: 0 }}
                  transition={{ duration: 1.5, delay: k * 0.16, ease: "easeOut" }}
                />
              ))}
              <SparkleBurst />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[43]"
                style={{ background: "radial-gradient(circle at 50% 45%, #ffffff 0%, #fff2cf 42%, rgba(255,242,207,0) 82%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.97, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut", times: [0, 0.5, 1] }}
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
                animate={{ opacity: [0, 1, 0], scale: [0.35, 1.7, 2.4] }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              {[0, 1].map((k) => (
                <motion.div
                  key={k}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 z-[45] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ top: POINT, width: 120, height: 120, marginLeft: 0, border: "2px solid rgba(255,236,180,0.9)" }}
                  initial={{ scale: 0, opacity: 0.9 }}
                  animate={{ scale: 5, opacity: 0 }}
                  transition={{ duration: 1, delay: k * 0.18, ease: "easeOut" }}
                />
              ))}
            </>
          )}

          {/* top flap */}
          <motion.div
            className="pointer-events-none absolute left-0 top-0 w-full"
            style={{ height: POINT, transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: opened ? 20 : 40 }}
            animate={{ rotateX: opened ? -168 : 0, opacity: opened ? 0 : 1 }}
            transition={{ rotateX: { duration: 1.2, ease: [0.55, 0, 0.2, 1] }, opacity: { duration: 0.8, ease: easeCinematic, delay: 0.5 } }}
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
            animate={{ opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.4 }}
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
      {site.music.src && <audio ref={audioRef} src={site.music.src} loop preload="auto" />}

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
