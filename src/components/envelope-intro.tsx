"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio-manager";
import { useGuestName } from "@/lib/use-guest-name";
import { weddingData } from "@/lib/wedding-data";

type EnvelopeState = "sealed" | "cracking" | "opening" | "sliding" | "open" | "closing";

/* Paper easing curves — mimic real paper movement */
const EASE_PAPER = [0.16, 1, 0.3, 1] as const;
const EASE_SLIDE = [0.22, 1, 0.36, 1] as const;
const EASE_CRACK = [0.34, 1.56, 0.64, 1] as const;
const EASE_CLOSE = [0.4, 0, 0.2, 1] as const;

/* Haptic feedback */
function haptic(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {}
}

/* Ornate gold corner flourish */
function Flourish({ className, style, size = 60 }: { className?: string; style?: React.CSSProperties; size?: number }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 70 70" fill="none" aria-hidden>
      <path
        d="M4 4 C4 30, 20 44, 46 44 M4 4 C30 4, 44 20, 44 46 M4 4 C4 18, 10 24, 24 24 M4 4 C18 4, 24 10, 24 24"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="46" cy="46" r="2.4" fill="url(#goldGrad)" />
      <circle cx="24" cy="24" r="1.6" fill="url(#goldGrad)" />
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8863F" />
          <stop offset="0.5" stopColor="#E6CE88" />
          <stop offset="1" stopColor="#C9A85C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Decorative gold border frame for invitation card */
function GoldBorder({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 200 280" preserveAspectRatio="none" aria-hidden>
      <rect x="3" y="3" width="194" height="274" rx="4" stroke="url(#borderGrad)" strokeWidth="1.5" fill="none" />
      <rect x="8" y="8" width="184" height="264" rx="2" stroke="url(#borderGrad)" strokeWidth="0.6" fill="none" opacity="0.6" />
      <defs>
        <linearGradient id="borderGrad" x1="0" y1="0" x2="200" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A8863F" />
          <stop offset="0.5" stopColor="#E6CE88" />
          <stop offset="1" stopColor="#C9A85C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Wax seal with crack lines */
function WaxSeal({ cracking, monogram }: { cracking: boolean; monogram: string }) {
  return (
    <div
      className="relative rounded-full flex items-center justify-center"
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(circle at 34% 28%, #FFF5D6 0%, #E6CE88 16%, #C9A85C 42%, #A8863F 68%, #8A6D2F 86%, #6B5524 100%)",
        boxShadow:
          "0 6px 20px rgba(108,85,36,0.55), inset 0 -4px 8px rgba(80,60,20,0.5), inset 0 4px 8px rgba(255,248,225,0.5), 0 0 0 2px rgba(168,134,63,0.2)",
        overflow: "hidden",
      }}
    >
      {/* Notched seal edge */}
      <span
        className="absolute rounded-full pointer-events-none"
        style={{ inset: "5px", border: "1.5px dashed rgba(80,60,20,0.4)" }}
      />
      {/* Specular highlight */}
      <span
        className="absolute rounded-full bg-white/50 blur-[5px]"
        style={{ width: "34%", height: "34%", top: "14%", left: "16%" }}
      />
      {/* Shimmer sweep */}
      <span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.45) 48%, transparent 62%)",
          backgroundSize: "200% 100%",
          animation: "sealShimmer 3s ease-in-out infinite",
        }}
      />
      {/* Crack lines (appear when cracking) */}
      <AnimatePresence>
        {cracking && (
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.path
              d="M50 15 L45 35 L52 50 L40 70 L48 88"
              stroke="rgba(60,40,15,0.7)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <motion.path
              d="M50 15 L58 30 L50 45 L62 65 L55 85"
              stroke="rgba(60,40,15,0.6)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
            />
            <motion.path
              d="M50 30 L35 45 L42 55"
              stroke="rgba(60,40,15,0.5)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.1 }}
            />
            <motion.path
              d="M50 30 L68 42 L60 55"
              stroke="rgba(60,40,15,0.5)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.25, ease: "easeOut", delay: 0.12 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
      {/* Monogram */}
      <span
        className="relative font-script text-white"
        style={{
          fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
          textShadow: "0 1px 3px rgba(74,60,36,0.7), 0 0 8px rgba(201,168,92,0.4)",
        }}
      >
        {monogram}
      </span>
    </div>
  );
}

/* Paper texture overlay */
function PaperTexture({ className, opacity = 0.4 }: { className?: string; opacity?: number }) {
  return (
    <div
      className={className}
      aria-hidden
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.78 0 0 0 0 0.6 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity,
        mixBlendMode: "multiply",
      }}
    />
  );
}

export default function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const { playSound, startMusic, stopMusic } = useAudio();
  const guestName = useGuestName();
  const [state, setState] = useState<EnvelopeState>("sealed");
  const [sealCracking, setSealCracking] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardOut, setCardOut] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [zoomIn, setZoomIn] = useState(false);
  const [sceneOpen, setSceneOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(true), 350);
    return () => clearTimeout(t);
  }, []);

  // Clear all timers on unmount
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  const openEnvelope = useCallback(() => {
    if (state !== "sealed") return;
    setState("cracking");

    // Phase 1: Wax cracks (0ms)
    haptic(30);
    playSound("wax-crack", 0.7);
    setSealCracking(true);

    // Phase 2: Wax pieces fall away (500ms)
    addTimer(() => {
      haptic([15, 20, 15]);
      setSealGone(true);
    }, 500);

    // Phase 3: Flap lifts slowly (800ms — 2400ms, 1.6s duration)
    addTimer(() => {
      setState("opening");
      playSound("paper-unfold", 0.5);
      haptic(20);
      setFlapOpen(true);
    }, 800);

    // Phase 4: Invitation card slides up (2600ms — 4200ms, 1.6s duration)
    addTimer(() => {
      setState("sliding");
      playSound("paper-unfold", 0.3);
      setCardOut(true);
    }, 2600);

    // Phase 5: Card locks + camera zoom + music fades in (4400ms)
    addTimer(() => {
      haptic([10, 30, 10]);
      playSound("chime", 0.5);
      setZoomIn(true);
      startMusic();
      setState("open");
    }, 4400);

    // Phase 6: The wedding world forms around the physical card (5000ms)
    addTimer(() => {
      setSceneOpen(true);
    }, 5000);

    // Phase 7: Scroll hint appears after the world has settled (6800ms)
    addTimer(() => {
      setShowScrollHint(true);
    }, 6800);

    // Phase 8: Notify parent after the first cinematic moment finishes (7200ms)
    addTimer(() => onOpen(), 7200);
  }, [state, playSound, startMusic, onOpen]);

  const closeEnvelope = useCallback(() => {
    if (state !== "open") return;
    setState("closing");
    stopMusic();
    setShowScrollHint(false);
    setZoomIn(false);
    setSceneOpen(false);

    // Card slides back down (200ms — 1400ms)
    addTimer(() => {
      setCardOut(false);
      playSound("paper-unfold", 0.3);
    }, 200);

    // Flap closes (1600ms — 2800ms)
    addTimer(() => {
      setFlapOpen(false);
      playSound("paper-unfold", 0.4);
      haptic(15);
    }, 1600);

    // Wax seal reforms (3000ms)
    addTimer(() => {
      setSealGone(false);
      setSealCracking(false);
      playSound("seal-pop", 0.4);
      haptic(20);
    }, 3000);

    // Settle (3400ms)
    addTimer(() => {
      setState("sealed");
    }, 3400);
  }, [state, stopMusic, playSound]);

  // Bidirectional: when scrolled back to top, close envelope
  useEffect(() => {
    if (state !== "open") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.85) {
            closeEnvelope();
          }
        });
      },
      { threshold: [0.85] }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [state, closeEnvelope]);

  const { monogram } = weddingData.couple;

  // Photorealistic paper colors
  const envelopeBody = "linear-gradient(170deg, #F5EFD8 0%, #EDE3C8 30%, #E2D4B0 70%, #D4C49A 100%)";
  const flapFace = "linear-gradient(175deg, #F0E6CC 0%, #E8DAB4 50%, #D8C8A0 100%)";
  const flapBack = "linear-gradient(175deg, #E8DAB4 0%, #DCC9A0 50%, #C9B888 100%)";
  const cardFace = "linear-gradient(175deg, #FFFDF7 0%, #FAF4E6 40%, #F3E9D2 100%)";
  const goldEdge = "1px solid rgba(180,150,80,0.4)";

  // Envelope dimensions — portrait, mobile-first: dominates width while respecting viewport height
  const envW = "min(86vw, 58dvh)";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: sceneOpen
          ? "radial-gradient(ellipse 80% 55% at 50% 18%, rgba(255,246,218,0.42) 0%, transparent 54%), linear-gradient(180deg, #1F271C 0%, #2F241A 45%, #120E0A 100%)"
          : "radial-gradient(ellipse 90% 70% at 50% 40%, #2A2520 0%, #1C1814 50%, #100E0A 100%)",
        transition: "background 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity, background",
      }}
    >
      {/* ===== SUBTLE VIGNETTE ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <AnimatePresence>
        {sceneOpen && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: EASE_PAPER }}
          >
            <motion.div
              className="absolute left-1/2 top-[8vh] -translate-x-1/2 rounded-t-full"
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.7, ease: EASE_PAPER }}
              style={{
                width: "min(470px, 108vw)",
                height: "min(540px, 118vw)",
                border: "1px solid rgba(201,168,92,0.35)",
                borderBottom: "none",
                boxShadow: "0 0 60px rgba(201,168,92,0.18), inset 0 0 36px rgba(201,168,92,0.08)",
              }}
            />

            {[...Array(26)].map((_, i) => (
              <motion.span
                key={`flower-${i}`}
                className="absolute rounded-full"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.2 + (i % 8) * 0.08, ease: EASE_PAPER }}
                style={{
                  left: `${8 + ((i * 13) % 84)}%`,
                  top: `${10 + ((i * 19) % 46)}%`,
                  width: `${10 + (i % 4) * 4}px`,
                  height: `${10 + (i % 4) * 4}px`,
                  background: i % 3 === 0
                    ? "radial-gradient(circle at 35% 35%, #FFF8E7 0%, #EAD7B4 55%, rgba(234,215,180,0) 72%)"
                    : "radial-gradient(circle at 35% 35%, #F7E8D2 0%, #C9A85C 48%, rgba(201,168,92,0) 72%)",
                  filter: "blur(0.1px)",
                }}
              />
            ))}

            {[...Array(14)].map((_, i) => (
              <motion.span
                key={`petal-${i}`}
                className="absolute rounded-full"
                initial={{ opacity: 0, y: -30, rotate: 0 }}
                animate={{ opacity: [0, 0.7, 0.15], y: [0, 130 + i * 6], rotate: [0, 120 + i * 18] }}
                transition={{ duration: 7 + (i % 5), repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
                style={{
                  left: `${6 + ((i * 17) % 88)}%`,
                  top: `${6 + (i % 4) * 6}%`,
                  width: `${7 + (i % 3)}px`,
                  height: `${11 + (i % 4)}px`,
                  background: "linear-gradient(135deg, rgba(255,246,225,0.85), rgba(201,168,92,0.45))",
                  borderRadius: "70% 30% 70% 30%",
                }}
              />
            ))}

            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`candle-${i}`}
                className="absolute bottom-[13vh]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.45 + i * 0.12, ease: EASE_PAPER }}
                style={{ left: `${12 + i * 24}%` }}
              >
                <div className="relative w-[8px] h-[38px] rounded-sm bg-[#F4E8CF]/80 shadow-[0_0_18px_rgba(255,230,160,0.22)]">
                  <motion.span
                    className="absolute left-1/2 -top-3 block w-[10px] h-[16px] -translate-x-1/2 rounded-full"
                    animate={{ scale: [1, 1.14, 0.94, 1], opacity: [0.75, 1, 0.72, 0.9] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                    style={{ background: "radial-gradient(ellipse, #FFE6A0 0%, rgba(255,180,70,0.4) 42%, transparent 72%)" }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FLOATING DUST PARTICLES (subtle, cinematic) ===== */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              bottom: `${-5 + (i % 3) * 8}%`,
              width: `${2 + (i % 2)}px`,
              height: `${2 + (i % 2)}px`,
              background: "radial-gradient(circle, rgba(230,206,136,0.6), transparent)",
              animation: `floatUp ${18 + (i % 4) * 4}s linear infinite`,
              animationDelay: `${-i * 3}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* ===== GREETING (minimal — only guest name, very small) ===== */}
      <AnimatePresence>
        {state === "sealed" && guestName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="absolute top-[12vh] left-1/2 -translate-x-1/2 z-10 font-script text-[#C9A85C] text-lg md:text-xl tracking-wide"
          >
            Dear {guestName}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ===== ENVELOPE STAGE (with camera zoom) ===== */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
        animate={{
          opacity: introVisible ? 1 : 0,
          scale: !introVisible ? 0.94 : sceneOpen ? 1.12 : zoomIn ? 1.08 : 1,
          y: sceneOpen ? -12 : 0,
          filter: introVisible ? "blur(0px)" : "blur(8px)",
        }}
        style={{
          width: envW,
          aspectRatio: "320 / 440",
          perspective: "1400px",
          perspectiveOrigin: "50% 40%",
        }}
        transition={{ duration: introVisible ? 1.4 : 0.2, ease: EASE_PAPER }}
      >
        {/* ===== ENVELOPE BODY (back layer — the pocket) ===== */}
        <motion.div
          className="absolute inset-0 rounded-[4px]"
          animate={
            state === "sealed" && introVisible
              ? { y: [0, -5, 0, 3, 0], rotateZ: [-0.25, 0.18, -0.12, 0] }
              : { y: 0, rotateZ: 0 }
          }
          transition={
            state === "sealed" && introVisible
              ? { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.8, ease: EASE_PAPER }
          }
          style={{
            background: envelopeBody,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.6), 0 15px 40px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,250,235,0.3), inset 0 -4px 12px rgba(120,100,50,0.2)",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Paper texture on body */}
          <PaperTexture className="absolute inset-0 rounded-[4px]" opacity={0.35} />

          {/* Subtle inner shadow at top (where flap meets body) */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "50%",
              background: "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />

          {/* ===== ENVELOPE INTERIOR (dark, visible when flap opens) ===== */}
          <div
            className="absolute left-0 right-0 bottom-0 rounded-b-[4px] overflow-hidden"
            style={{
              top: "5%",
              background: "linear-gradient(180deg, #D8C8A0 0%, #C9B888 30%, #B8A678 100%)",
              boxShadow: "inset 0 4px 20px rgba(80,60,20,0.3)",
            }}
          >
            <PaperTexture className="absolute inset-0" opacity={0.25} />
          </div>

          {/* ===== INVITATION CARD (slides up from inside) ===== */}
          <motion.div
            className="absolute left-[6%] right-[6%] rounded-[3px] overflow-hidden"
            style={{
              bottom: "4%",
              height: "82%",
              background: cardFace,
              boxShadow: cardOut
                ? "0 30px 80px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.2)"
                : "0 0 0 rgba(0,0,0,0)",
              zIndex: 2,
              willChange: "transform, opacity",
              transformOrigin: "bottom center",
            }}
            animate={{
              y: sceneOpen ? "-86%" : cardOut ? "-72%" : "0%",
              scale: sceneOpen ? 1.1 : cardOut ? 1.05 : 0.96,
              opacity: cardOut ? 1 : 0,
            }}
            transition={{
              duration: cardOut ? 1.6 : 1.2,
              ease: cardOut ? EASE_SLIDE : EASE_CLOSE,
            }}
          >
            {/* Paper texture on card */}
            <PaperTexture className="absolute inset-0" opacity={0.3} />

            {/* Gold border */}
            <div className="absolute inset-2 rounded-[2px] pointer-events-none" style={{ border: "1px solid rgba(201,168,92,0.35)" }} />
            <div className="absolute inset-3 rounded-[1px] pointer-events-none" style={{ border: "0.5px solid rgba(201,168,92,0.2)" }} />

            {/* Corner flourishes */}
            <Flourish className="absolute top-2 left-2" size={32} />
            <Flourish className="absolute top-2 right-2" size={32} style={{ transform: "scaleX(-1)" }} />
            <Flourish className="absolute bottom-2 left-2" size={32} style={{ transform: "scaleY(-1)" }} />
            <Flourish className="absolute bottom-2 right-2" size={32} style={{ transform: "scale(-1)" }} />

            {/* Card content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
              <p className="uppercase tracking-[0.3em] text-[#A8863F] text-[8px] md:text-[10px] mb-3">
                Together with their families
              </p>
              <p className="font-script text-gold-foil text-2xl md:text-4xl leading-tight">
                {weddingData.couple.bride}
              </p>
              <p className="font-script text-[#C9A85C] text-xl md:text-3xl my-0.5">&amp;</p>
              <p className="font-script text-gold-foil text-2xl md:text-4xl leading-tight">
                {weddingData.couple.groom}
              </p>
              <div className="my-3 flex items-center gap-2">
                <span className="block w-12 h-px bg-[#C9A85C]/40" />
                <span className="text-[#C9A85C] text-[10px]">✦</span>
                <span className="block w-12 h-px bg-[#C9A85C]/40" />
              </div>
              <p className="font-serif-text italic text-[#6E6252] text-xs md:text-sm">
                {weddingData.date.display}
              </p>
              <p className="text-[#988A76] text-[9px] md:text-[11px] mt-1.5 tracking-wider">
                {weddingData.venues.ceremony.name}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-0 right-0 bottom-0 overflow-hidden rounded-b-[4px]"
            style={{
              height: "52%",
              zIndex: 3,
              background: "linear-gradient(165deg, #EDE1BF 0%, #D8C8A0 52%, #C6B17E 100%)",
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              boxShadow: "inset 0 5px 18px rgba(255,250,230,0.18), inset 0 -8px 20px rgba(80,60,20,0.18), 0 -2px 12px rgba(65,45,18,0.16)",
              willChange: "transform",
            }}
            animate={{ rotateX: flapOpen ? 4 : 0 }}
            transition={{ duration: 1.4, ease: EASE_PAPER }}
          >
            <PaperTexture className="absolute inset-0" opacity={0.28} />
          </motion.div>

          <motion.div
            className="absolute left-0 top-0 bottom-0 rounded-l-[4px]"
            style={{
              width: "50%",
              zIndex: 4,
              background: "linear-gradient(150deg, #F0E6CC 0%, #DECFAB 58%, #CBB989 100%)",
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              boxShadow: "inset -8px 0 18px rgba(90,70,30,0.12)",
              willChange: "transform",
            }}
            animate={{ rotateY: flapOpen ? -5 : 0 }}
            transition={{ duration: 1.4, ease: EASE_PAPER }}
          >
            <PaperTexture className="absolute inset-0" opacity={0.26} />
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 bottom-0 rounded-r-[4px]"
            style={{
              width: "50%",
              zIndex: 4,
              background: "linear-gradient(210deg, #F0E6CC 0%, #DECFAB 58%, #CBB989 100%)",
              clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
              boxShadow: "inset 8px 0 18px rgba(90,70,30,0.12)",
              willChange: "transform",
            }}
            animate={{ rotateY: flapOpen ? 5 : 0 }}
            transition={{ duration: 1.4, ease: EASE_PAPER }}
          >
            <PaperTexture className="absolute inset-0" opacity={0.26} />
          </motion.div>

          {/* ===== TOP FLAP (the main flap that lifts open) ===== */}
          <motion.div
            className="absolute top-0 left-0 right-0 overflow-hidden rounded-t-[4px]"
            style={{
              height: "52%",
              background: flapFace,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              willChange: "transform",
              zIndex: 5,
              boxShadow: "inset 0 -4px 16px rgba(120,100,50,0.15), 0 2px 8px rgba(0,0,0,0.1)",
              borderBottom: "1px solid rgba(180,150,80,0.3)",
            }}
            animate={{
              rotateX: flapOpen ? -175 : 0,
            }}
            transition={{
              duration: flapOpen ? 1.6 : 1.2,
              ease: flapOpen ? EASE_PAPER : EASE_CLOSE,
            }}
          >
            {/* Back of flap (visible when folded open) */}
            <div
              className="absolute inset-0"
              style={{
                background: flapBack,
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <PaperTexture className="absolute inset-0" opacity={0.3} />
            </div>

            {/* Front of flap texture */}
            <PaperTexture className="absolute inset-0" opacity={0.3} />
            <div
              className="absolute left-0 right-0 bottom-0"
              style={{
                height: "3px",
                background: "linear-gradient(90deg, rgba(120,95,45,0.1), rgba(255,246,218,0.5), rgba(120,95,45,0.1))",
                boxShadow: "0 2px 4px rgba(70,45,15,0.2)",
              }}
            />

            {/* Flap filigree */}
            <Flourish className="absolute top-2 left-2" size={36} />
            <Flourish className="absolute top-2 right-2" size={36} style={{ transform: "scaleX(-1)" }} />

            {/* Monogram watermark on flap */}
            <div
              className="absolute left-1/2 top-[30%] -translate-x-1/2 font-script pointer-events-none"
              style={{
                fontSize: "clamp(1.8rem, 7vw, 2.5rem)",
                color: "rgba(201,168,92,0.12)",
              }}
              aria-hidden
            >
              {monogram}
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: "clamp(74px, 24vw, 104px)",
              height: "clamp(74px, 24vw, 104px)",
              zIndex: 9,
              background: "radial-gradient(circle, rgba(95,65,25,0.28), rgba(95,65,25,0.08) 46%, transparent 72%)",
              filter: "blur(2px)",
              willChange: "opacity, transform",
            }}
            animate={{ opacity: sealGone ? 0 : 1, scale: sealCracking ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: EASE_PAPER }}
          />

          {/* ===== WAX SEAL ===== */}
          <AnimatePresence>
            {!sealGone && (
              <motion.button
                onClick={openEnvelope}
                className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center"
                style={{
                  width: "clamp(68px, 22vw, 96px)",
                  height: "clamp(68px, 22vw, 96px)",
                  zIndex: 10,
                  willChange: "transform, opacity",
                }}
                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                animate={{
                  scale: sealCracking ? [1, 1.05, 0.98, 1.02, 1] : 1,
                  opacity: 1,
                  rotate: 0,
                }}
                exit={{
                  scale: [1, 1.3, 0.8],
                  opacity: [1, 0.5, 0],
                  rotate: [0, 8, -5],
                  y: [0, -10, 30],
                  transition: { duration: 0.5, ease: EASE_CRACK },
                }}
                transition={{
                  duration: sealCracking ? 0.4 : 0.3,
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Tap to open your invitation"
              >
                {/* Pulsing glow ring (only when sealed) */}
                {state === "sealed" && (
                  <span
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      inset: "-10px",
                      border: "2px solid rgba(201,168,92,0.4)",
                      animation: "pulseRing 2.5s ease-out infinite",
                    }}
                  />
                )}
                <WaxSeal cracking={sealCracking} monogram={monogram} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ===== ENVELOPE SHADOW ON GROUND ===== */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              bottom: "-20px",
              width: "85%",
              height: "30px",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* ===== TAP HINT (minimal, below envelope) ===== */}
      <AnimatePresence>
        {state === "sealed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 z-10 text-center"
          >
            <motion.p
              className="font-script text-[#C9A85C] text-base md:text-lg"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Tap the seal
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SCROLL HINT (after envelope opens) ===== */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 z-10 text-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-[#C9A85C] text-[10px] uppercase tracking-[0.4em]">Scroll</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-[#C9A85C]">
                <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <motion.circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill="currentColor"
                  animate={{ cy: [8, 16, 8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
