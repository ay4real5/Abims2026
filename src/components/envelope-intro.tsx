"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio-manager";
import { useGuestName } from "@/lib/use-guest-name";
import { weddingData } from "@/lib/wedding-data";

/* ═══════════════════════════════════════════════════════════
   EASING — everything glides, nothing bounces
   ═══════════════════════════════════════════════════════════ */
const EASE_GLIDE = [0.25, 0.1, 0.25, 1] as const;
const EASE_HEAVY = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════
   HAPTIC FEEDBACK
   ═══════════════════════════════════════════════════════════ */
function haptic(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {}
}

/* ═══════════════════════════════════════════════════════════
   PAPER TEXTURE — SVG noise for cotton paper feel
   ═══════════════════════════════════════════════════════════ */
function PaperGrain({ opacity = 0.4 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.82 0 0 0 0 0.74 0 0 0 0 0.56 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity,
        mixBlendMode: "multiply",
        pointerEvents: "none",
        borderRadius: "inherit",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   WAX SEAL — photorealistic with imperfections
   ═══════════════════════════════════════════════════════════ */
function WaxSeal({
  cracking,
  monogram,
}: {
  cracking: boolean;
  monogram: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 35% 30%, #C9A050 0%, #A87D30 20%, #8A6225 45%, #6B4A1A 70%, #4A3215 90%, #3A2810 100%)",
        boxShadow:
          "0 4px 14px rgba(60,40,15,0.6), inset 0 -5px 10px rgba(30,20,5,0.5), inset 0 4px 8px rgba(255,220,150,0.25), 0 0 0 2px rgba(100,70,25,0.15)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Wax imperfections — irregular edge bumps */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        aria-hidden
      >
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(60,40,15,0.15)" strokeWidth="0.5" strokeDasharray="2 1.5 1 2 3 1" />
      </svg>

      {/* Specular highlight — soft, off-center */}
      <div
        style={{
          position: "absolute",
          width: "38%",
          height: "38%",
          top: "12%",
          left: "14%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,230,170,0.4) 0%, transparent 70%)",
          filter: "blur(4px)",
        }}
      />

      {/* Crack lines */}
      <AnimatePresence>
        {cracking && (
          <motion.svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 100 100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M50 12 L44 32 L53 48 L38 68 L47 90"
              stroke="rgba(30,18,5,0.7)"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            <motion.path
              d="M50 12 L58 28 L49 44 L63 62 L54 86"
              stroke="rgba(30,18,5,0.55)"
              strokeWidth="1.1"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            />
            <motion.path
              d="M50 28 L34 42 L41 54"
              stroke="rgba(30,18,5,0.45)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: 0.1 }}
            />
            <motion.path
              d="M50 28 L68 40 L59 53"
              stroke="rgba(30,18,5,0.45)"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: 0.12 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Monogram — gold foil pressed into wax */}
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-script), 'Great Vibes', cursive",
          fontSize: "clamp(1rem, 4.5vw, 1.5rem)",
          color: "#E6CE88",
          textShadow:
            "0 1px 2px rgba(30,18,5,0.8), 0 0 6px rgba(201,168,92,0.3), inset 0 1px 1px rgba(255,230,170,0.2)",
          letterSpacing: "0.02em",
        }}
      >
        {monogram}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GOLD FOIL MONOGRAM — for envelope front
   ═══════════════════════════════════════════════════════════ */
function GoldFoilMonogram({ text }: { text: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-script), 'Great Vibes', cursive",
        background:
          "linear-gradient(105deg, #A8863F 0%, #E6CE88 30%, #FBF3E2 50%, #D4B876 70%, #A8863F 100%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        animation: "goldShine 8s linear infinite",
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */
type Phase = "void" | "sealed" | "cracking" | "opening" | "revealed";

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function EnvelopeIntro({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const { playSound, startMusic } = useAudio();
  const guestName = useGuestName();
  const [phase, setPhase] = useState<Phase>("void");
  const [sealCracking, setSealCracking] = useState(false);
  const [sealGone, setSealGone] = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [cardOut, setCardOut] = useState(false);
  const [envelopeGone, setEnvelopeGone] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { monogram, bride, groom } = weddingData.couple;
  const { display: dateDisplay } = weddingData.date;
  const { name: venueName } = weddingData.venues.ceremony;

  /* ── Fade in from darkness ── */
  useEffect(() => {
    const t = setTimeout(() => setPhase("sealed"), 800);
    return () => clearTimeout(t);
  }, []);

  /* ── Clear timers on unmount ── */
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  /* ═══════════════════════════════════════════════════════════
     OPEN SEQUENCE — slow, deliberate, cinematic (~3s)
     ═══════════════════════════════════════════════════════════ */
  const openEnvelope = useCallback(() => {
    if (phase !== "sealed") return;

    /* Phase 1: Wax cracks (0ms) */
    setPhase("cracking");
    haptic(25);
    playSound("wax-crack", 0.6);
    setSealCracking(true);

    /* Phase 2: Wax falls away (600ms) */
    addTimer(() => {
      haptic([12, 15, 12]);
      setSealGone(true);
    }, 600);

    /* Phase 3: Flap lifts slowly (900ms — 2.1s, 1.2s duration) */
    addTimer(() => {
      setPhase("opening");
      playSound("paper-unfold", 0.45);
      haptic(15);
      setFlapOpen(true);
    }, 900);

    /* Phase 4: Card slides up (2200ms — 3.2s, 1s duration) */
    addTimer(() => {
      playSound("paper-unfold", 0.3);
      setCardOut(true);
    }, 2200);

    /* Phase 5: Envelope fades away — scene change (3400ms) */
    addTimer(() => {
      haptic([8, 20, 8]);
      playSound("chime", 0.4);
      startMusic();
      setEnvelopeGone(true);
      setPhase("revealed");
    }, 3400);

    /* Phase 6: Scroll hint (4200ms) */
    addTimer(() => {
      setShowScrollHint(true);
    }, 4200);

    /* Phase 7: Notify parent (4600ms) */
    addTimer(() => onOpen(), 4600);
  }, [phase, playSound, startMusic, onOpen]);

  /* ═══════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════ */

  /* Muted, rich color palette */
  const paperColor =
    "linear-gradient(168deg, #E8DFC8 0%, #DDD0B4 35%, #CDBE9C 70%, #B8A682 100%)";
  const flapColor =
    "linear-gradient(172deg, #E2D6BC 0%, #D4C5A4 50%, #BEAE88 100%)";
  const flapBack =
    "linear-gradient(172deg, #D4C5A4 0%, #C4B290 50%, #AE9C72 100%)";
  const cardColor =
    "linear-gradient(175deg, #F5EEDC 0%, #EDE3CC 40%, #E0D3B6 100%)";

  /* Envelope sizing — dominates mobile screen */
  const envWidth = "min(88vw, 380px)";

  return (
    <section
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: envelopeGone
          ? "linear-gradient(180deg, #1A1714 0%, #221E18 40%, #1A1714 100%)"
          : "radial-gradient(ellipse 85% 65% at 50% 45%, #1E1B16 0%, #15120E 55%, #0A0907 100%)",
        transition: "background 2s cubic-bezier(0.25, 0.1, 0.25, 1)",
      }}
    >
      {/* ═══ AMBIENT VIGNETTE ═══ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 75% 55% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ═══ AMBIENT PARTICLES — tiny, slow, cinematic ═══ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden>
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${15 + (i * 14) % 70}%`,
              bottom: `${-8 + (i % 3) * 12}%`,
              width: `${1.5 + (i % 2)}px`,
              height: `${1.5 + (i % 2)}px`,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,180,130,0.5), transparent)",
              animation: `floatUp ${20 + (i % 4) * 5}s linear infinite`,
              animationDelay: `${-i * 4}s`,
              opacity: 0.25,
            }}
          />
        ))}
      </div>

      {/* ═══ ENVELOPE SCENE (disappears after opening) ═══ */}
      <AnimatePresence>
        {!envelopeGone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
            animate={{
              opacity: phase === "void" ? 0 : 1,
              scale: phase === "void" ? 0.92 : 1,
              filter: phase === "void" ? "blur(10px)" : "blur(0px)",
            }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
            transition={{ duration: 2.5, ease: EASE_GLIDE }}
            style={{
              position: "relative",
              width: envWidth,
              aspectRatio: "3 / 4.1",
              perspective: "1200px",
              perspectiveOrigin: "50% 35%",
            }}
          >
            {/* Idle floating wrapper */}
            <motion.div
              animate={
                phase === "sealed"
                  ? { y: [0, -6, 0, 4, 0], rotateZ: [-0.2, 0.15, -0.1, 0] }
                  : { y: 0, rotateZ: 0 }
              }
              transition={
                phase === "sealed"
                  ? { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 1, ease: EASE_GLIDE }
              }
              style={{
                position: "absolute",
                inset: 0,
                transformStyle: "preserve-3d",
              }}
            >
              {/* ════ ENVELOPE BODY (back/pocket) ════ */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "3px",
                  background: paperColor,
                  boxShadow:
                    "0 3px 10px rgba(0,0,0,0.3), 0 18px 45px rgba(0,0,0,0.35), 0 50px 100px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,245,220,0.2), inset 0 -3px 10px rgba(100,80,40,0.15)",
                  transformStyle: "preserve-3d",
                  overflow: "hidden",
                }}
              >
                <PaperGrain opacity={0.35} />

                {/* Warm light from top-left */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse 55% 40% at 28% 12%, rgba(255,245,220,0.35) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Shadow where flap meets body */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "48%",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* ════ ENVELOPE INTERIOR (visible when flap opens) ════ */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: "4%",
                    background:
                      "linear-gradient(180deg, #C4B290 0%, #B8A678 30%, #A6966A 100%)",
                    boxShadow: "inset 0 3px 15px rgba(70,50,20,0.25)",
                  }}
                >
                  <PaperGrain opacity={0.2} />
                </div>

                {/* ════ INVITATION CARD (clipped inside pocket) ════ */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    borderRadius: "3px",
                    zIndex: 2,
                  }}
                >
                  <motion.div
                    animate={{
                      y: cardOut ? "-68%" : "0%",
                      scale: cardOut ? 1.04 : 1,
                    }}
                    transition={{
                      duration: cardOut ? 1.2 : 1,
                      ease: EASE_HEAVY,
                    }}
                    style={{
                      position: "absolute",
                      left: "7%",
                      right: "7%",
                      bottom: "5%",
                      height: "80%",
                      borderRadius: "2px",
                      background: cardColor,
                      boxShadow: cardOut
                        ? "0 20px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.15)"
                        : "0 0 0 rgba(0,0,0,0)",
                      overflow: "hidden",
                      transformOrigin: "bottom center",
                    }}
                  >
                    <PaperGrain opacity={0.28} />

                    {/* Gold border */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "8px",
                        border: "1px solid rgba(168,134,63,0.3)",
                        borderRadius: "1px",
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: "12px",
                        border: "0.5px solid rgba(168,134,63,0.18)",
                        borderRadius: "1px",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Card content */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "0 16px",
                      }}
                    >
                      <p
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: "0.28em",
                          color: "#988A76",
                          fontSize: "clamp(7px, 2.5vw, 9px)",
                          margin: 0,
                          marginBottom: "10px",
                        }}
                      >
                        Together with their families
                      </p>
                      <p
                        className="font-script"
                        style={{
                          fontSize: "clamp(1.4rem, 7vw, 2rem)",
                          margin: 0,
                          lineHeight: 1.1,
                        }}
                      >
                        <GoldFoilMonogram text={bride} />
                      </p>
                      <p
                        className="font-script"
                        style={{
                          fontSize: "clamp(1rem, 5vw, 1.5rem)",
                          color: "#B08D3F",
                          margin: "2px 0",
                        }}
                      >
                        &
                      </p>
                      <p
                        className="font-script"
                        style={{
                          fontSize: "clamp(1.4rem, 7vw, 2rem)",
                          margin: 0,
                          lineHeight: 1.1,
                        }}
                      >
                        <GoldFoilMonogram text={groom} />
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          margin: "10px 0",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            width: "32px",
                            height: "1px",
                            background: "rgba(168,134,63,0.35)",
                          }}
                        />
                        <span style={{ color: "#B08D3F", fontSize: "8px" }}>
                          ✦
                        </span>
                        <span
                          style={{
                            display: "block",
                            width: "32px",
                            height: "1px",
                            background: "rgba(168,134,63,0.35)",
                          }}
                        />
                      </div>
                      <p
                        className="font-serif-text"
                        style={{
                          fontStyle: "italic",
                          color: "#6E6252",
                          fontSize: "clamp(10px, 3.5vw, 13px)",
                          margin: 0,
                        }}
                      >
                        {dateDisplay}
                      </p>
                      <p
                        style={{
                          color: "#988A76",
                          fontSize: "clamp(8px, 3vw, 10px)",
                          margin: 0,
                          marginTop: "6px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {venueName}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* ════ BOTTOM POCKET (front layer — covers card bottom) ════ */}
                <motion.div
                  animate={{ rotateX: flapOpen ? 3 : 0 }}
                  transition={{ duration: 1.2, ease: EASE_GLIDE }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "50%",
                    zIndex: 3,
                    background:
                      "linear-gradient(165deg, #DDD0B4 0%, #C8B898 52%, #B8A67E 100%)",
                    clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                    boxShadow:
                      "inset 0 4px 14px rgba(255,245,220,0.12), inset 0 -6px 16px rgba(70,50,20,0.15), 0 -1px 8px rgba(50,35,12,0.12)",
                    willChange: "transform",
                  }}
                >
                  <PaperGrain opacity={0.25} />
                </motion.div>

                {/* ════ LEFT POCKET ════ */}
                <motion.div
                  animate={{ rotateY: flapOpen ? -4 : 0 }}
                  transition={{ duration: 1.2, ease: EASE_GLIDE }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    zIndex: 4,
                    background:
                      "linear-gradient(150deg, #E2D6BC 0%, #D0C0A0 58%, #BCAA82 100%)",
                    clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                    boxShadow: "inset -6px 0 14px rgba(80,60,25,0.1)",
                    willChange: "transform",
                  }}
                >
                  <PaperGrain opacity={0.24} />
                </motion.div>

                {/* ════ RIGHT POCKET ════ */}
                <motion.div
                  animate={{ rotateY: flapOpen ? 4 : 0 }}
                  transition={{ duration: 1.2, ease: EASE_GLIDE }}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    zIndex: 4,
                    background:
                      "linear-gradient(210deg, #E2D6BC 0%, #D0C0A0 58%, #BCAA82 100%)",
                    clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                    boxShadow: "inset 6px 0 14px rgba(80,60,25,0.1)",
                    willChange: "transform",
                  }}
                >
                  <PaperGrain opacity={0.24} />
                </motion.div>

                {/* ════ TOP FLAP — 3D rotate, the hero animation ════ */}
                <motion.div
                  animate={{ rotateX: flapOpen ? -172 : 0 }}
                  transition={{
                    duration: flapOpen ? 1.3 : 1,
                    ease: EASE_GLIDE,
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background: flapColor,
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    zIndex: 5,
                    boxShadow:
                      "inset 0 -3px 12px rgba(100,80,40,0.12), 0 2px 6px rgba(0,0,0,0.08), 0 6px 18px rgba(0,0,0,0.1)",
                    borderBottom: "1px solid rgba(168,134,63,0.25)",
                    filter: flapOpen
                      ? "drop-shadow(0 10px 16px rgba(0,0,0,0.25))"
                      : "none",
                    willChange: "transform",
                    overflow: "hidden",
                  }}
                >
                  {/* Back of flap (visible when open) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: flapBack,
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                    }}
                  >
                    <PaperGrain opacity={0.28} />
                  </div>

                  {/* Front texture */}
                  <PaperGrain opacity={0.28} />

                  {/* Flap edge highlight */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "2px",
                      background:
                        "linear-gradient(90deg, rgba(100,80,40,0.08), rgba(255,245,220,0.4), rgba(100,80,40,0.08))",
                    }}
                  />

                  {/* Gold foil monogram watermark on flap */}
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "28%",
                      transform: "translateX(-50%)",
                      opacity: 0.12,
                      pointerEvents: "none",
                    }}
                  >
                    <GoldFoilMonogram text={monogram} />
                  </div>
                </motion.div>

                {/* ════ WAX SEAL SHADOW (attachment mark) ════ */}
                <motion.div
                  animate={{
                    opacity: sealGone ? 0 : 1,
                    scale: sealCracking ? 1.06 : 1,
                  }}
                  transition={{ duration: 0.4, ease: EASE_GLIDE }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "48%",
                    transform: "translate(-50%, -50%)",
                    width: "clamp(62px, 20vw, 88px)",
                    height: "clamp(62px, 20vw, 88px)",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(60,40,15,0.22), rgba(60,40,15,0.06) 46%, transparent 72%)",
                    filter: "blur(2px)",
                    zIndex: 8,
                    pointerEvents: "none",
                  }}
                />

                {/* ════ WAX SEAL (tappable) ════ */}
                <AnimatePresence>
                  {!sealGone && (
                    <motion.button
                      onClick={openEnvelope}
                      initial={{ scale: 0, opacity: 0, rotate: -15 }}
                      animate={{
                        scale: sealCracking ? [1, 1.04, 0.97, 1.01, 1] : 1,
                        opacity: 1,
                        rotate: 0,
                      }}
                      exit={{
                        scale: [1, 1.25, 0.75],
                        opacity: [1, 0.4, 0],
                        rotate: [0, 6, -4],
                        y: [0, -8, 24],
                        transition: { duration: 0.5, ease: EASE_GLIDE },
                      }}
                      transition={{ duration: sealCracking ? 0.35 : 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Tap to open your invitation"
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "48%",
                        transform: "translate(-50%, -50%)",
                        width: "clamp(56px, 18vw, 80px)",
                        height: "clamp(56px, 18vw, 80px)",
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        zIndex: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* Pulsing ring */}
                      {phase === "sealed" && (
                        <span
                          style={{
                            position: "absolute",
                            inset: "-8px",
                            borderRadius: "50%",
                            border: "1.5px solid rgba(168,134,63,0.35)",
                            animation: "pulseRing 3s ease-out infinite",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                      <WaxSeal cracking={sealCracking} monogram={monogram} />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* ════ GROUND SHADOW ════ */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "-16px",
                    transform: "translateX(-50%)",
                    width: "82%",
                    height: "24px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
                    filter: "blur(8px)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GREETING (guest name — minimal, above envelope) ═══ */}
      <AnimatePresence>
        {phase === "sealed" && guestName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, delay: 1 }}
            style={{
              position: "absolute",
              top: "11vh",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-script), 'Great Vibes', cursive",
              color: "#B08D3F",
              fontSize: "clamp(0.95rem, 4vw, 1.15rem)",
              letterSpacing: "0.03em",
              margin: 0,
              zIndex: 5,
            }}
          >
            Dear {guestName}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ═══ TAP HINT ═══ */}
      <AnimatePresence>
        {phase === "sealed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 1.5 }}
            style={{
              position: "absolute",
              bottom: "9vh",
              left: "50%",
              transform: "translateX(-50%)",
              textAlign: "center",
              zIndex: 5,
            }}
          >
            <motion.p
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: "var(--font-script), 'Great Vibes', cursive",
                color: "#B08D3F",
                fontSize: "clamp(0.85rem, 3.5vw, 1rem)",
                margin: 0,
              }}
            >
              Tap the seal
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SCROLL HINT (after reveal) ═══ */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: EASE_GLIDE }}
            style={{
              position: "absolute",
              bottom: "5vh",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
            }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span
                style={{
                  color: "#B08D3F",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.35em",
                }}
              >
                Scroll
              </span>
              <svg
                width="14"
                height="20"
                viewBox="0 0 16 24"
                fill="none"
                style={{ color: "#B08D3F" }}
              >
                <rect
                  x="1"
                  y="1"
                  width="14"
                  height="22"
                  rx="7"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <motion.circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill="currentColor"
                  animate={{ cy: [8, 15, 8] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
