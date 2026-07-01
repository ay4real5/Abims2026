"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio-manager";
import { useGuestName } from "@/lib/use-guest-name";
import { weddingData } from "@/lib/wedding-data";

type EnvelopeState = "sealed" | "opening" | "revealing" | "open" | "closing";

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

/* Decorative gold border frame */
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

/* Radial light rays SVG */
function LightRays({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden>
      <g style={{ transformOrigin: "200px 200px" }}>
        {[...Array(16)].map((_, i) => (
          <line
            key={i}
            x1="200"
            y1="200"
            x2={200 + 300 * Math.cos((i * 22.5 * Math.PI) / 180)}
            y2={200 + 300 * Math.sin((i * 22.5 * Math.PI) / 180)}
            stroke="url(#rayGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        ))}
      </g>
      <defs>
        <linearGradient id="rayGrad" x1="200" y1="200" x2="500" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E6CE88" stopOpacity="0.8" />
          <stop offset="1" stopColor="#E6CE88" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const { playSound } = useAudio();
  const guestName = useGuestName();
  const [state, setState] = useState<EnvelopeState>("sealed");
  const [sealBroken, setSealBroken] = useState(false);
  const [flapsOpen, setFlapsOpen] = useState(false);
  const [showLightBurst, setShowLightBurst] = useState(false);
  const [showInvitationCard, setShowInvitationCard] = useState(false);
  const [showCurtains, setShowCurtains] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const openEnvelope = useCallback(() => {
    if (state === "opening" || state === "revealing" || state === "open") return;
    setState("opening");

    // Phase 1: Seal breaks (0ms)
    playSound("seal-pop", 0.7);
    setSealBroken(true);

    // Phase 2: Flaps open (300ms)
    setTimeout(() => {
      playSound("paper-unfold", 0.5);
      setFlapsOpen(true);
    }, 300);

    // Phase 3: Light burst from inside envelope (700ms)
    setTimeout(() => {
      setShowLightBurst(true);
      playSound("chime", 0.6);
    }, 700);

    // Phase 4: Invitation card emerges from envelope (1000ms)
    setTimeout(() => {
      setShowInvitationCard(true);
      setState("revealing");
    }, 1000);

    // Phase 5: Card scales up, curtains wipe open (1600ms)
    setTimeout(() => {
      setShowCurtains(true);
      setContentVisible(true);
      setState("open");
    }, 1700);

    // Phase 6: Reveal main site (2400ms)
    setTimeout(() => onOpen(), 2500);
  }, [state, playSound, onOpen]);

  const closeEnvelope = useCallback(() => {
    if (state === "closing" || state === "sealed") return;
    setState("closing");
    setContentVisible(false);
    setShowCurtains(false);
    setShowInvitationCard(false);
    setShowLightBurst(false);
    setFlapsOpen(false);
    setTimeout(() => {
      setSealBroken(false);
      setState("sealed");
    }, 600);
  }, [state]);

  // Bidirectional re-fold: when scrolled back to top, close envelope
  useEffect(() => {
    if (state !== "open") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.8) {
            closeEnvelope();
          }
        });
      },
      { threshold: [0.8] }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [state, closeEnvelope]);

  const { monogram } = weddingData.couple;

  // Portrait envelope colors — warm ivory paper with champagne gold
  const paperFace = "linear-gradient(160deg, #FFFDF7 0%, #FAF6EC 40%, #F3E4C4 100%)";
  const flapFace = "linear-gradient(170deg, #FBF3E2 0%, #F3E4C4 55%, #E7D2A6 100%)";
  const flapFaceDark = "linear-gradient(170deg, #E7D2A6 0%, #D4B876 60%, #C9A85C 100%)";
  const goldEdge = "1.5px solid rgba(201,168,92,0.6)";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 py-8 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 80% at 50% 35%, #FFFDF7 0%, #FAF6EC 40%, #F2EAD6 75%, #E4D8BC 100%)",
      }}
    >
      {/* ===== CURTAIN REVEAL OVERLAY ===== */}
      <AnimatePresence>
        {showCurtains && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] pointer-events-none"
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              style={{
                background:
                  "linear-gradient(90deg, #4A3C24 0%, #8A6D2F 40%, #C9A85C 80%, #E6CE88 100%)",
              }}
            />
            <motion.div
              className="fixed inset-0 z-[100] pointer-events-none"
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              style={{
                background:
                  "linear-gradient(270deg, #4A3C24 0%, #8A6D2F 40%, #C9A85C 80%, #E6CE88 100%)",
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ===== LIGHT BURST (from envelope center when seal breaks) ===== */}
      <AnimatePresence>
        {showLightBurst && (
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-[90]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 6, opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              width: "300px",
              height: "300px",
              background:
                "radial-gradient(circle, rgba(255,253,247,0.95) 0%, rgba(230,206,136,0.6) 30%, rgba(201,168,92,0.2) 60%, transparent 80%)",
            }}
          >
            {/* Light rays */}
            <LightRays className="absolute inset-0 w-full h-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== FLOATING GOLD PARTICLES ===== */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 31) % 100}%`,
              bottom: `${-5 + (i % 3) * 5}%`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              background: "radial-gradient(circle, #E6CE88, rgba(201,168,92,0))",
              animation: `floatUp ${14 + (i % 5) * 3}s linear infinite`,
              animationDelay: `${-i * 1.8}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* ===== AMBIENT GLOW ===== */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "min(600px, 94vw)",
          height: "min(600px, 94vw)",
          background:
            "radial-gradient(circle, rgba(201,168,92,0.18) 0%, rgba(201,168,92,0.06) 40%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      {/* ===== GREETING ===== */}
      <AnimatePresence>
        {state === "sealed" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative z-10 text-center mb-5"
          >
            {guestName && (
              <p className="font-script text-gold-dark text-2xl md:text-3xl mb-1">
                Dear {guestName},
              </p>
            )}
            <p className="uppercase tracking-[0.5em] text-gold-dark text-[10px] md:text-sm font-medium">
              You&apos;re Invited
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PORTRAIT ENVELOPE ===== */}
      <motion.div
        className="envelope-container relative z-10"
        style={{
          width: "min(340px, 82vw)",
          height: "min(480px, 116vw)",
        }}
        animate={
          state === "sealed"
            ? { rotate: [-0.5, 0.5, -0.5] }
            : { rotate: 0 }
        }
        transition={
          state === "sealed"
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      >
        <div
          className="envelope-3d relative w-full h-full rounded-[8px]"
          style={{
            background: paperFace,
            boxShadow:
              "0 30px 80px rgba(138,109,47,0.25), 0 10px 30px rgba(138,109,47,0.12), inset 0 2px 4px rgba(255,253,247,0.6), inset 0 -2px 4px rgba(168,134,63,0.1)",
            border: goldEdge,
          }}
        >
          {/* Paper grain texture */}
          <div
            className="absolute inset-0 rounded-[8px] pointer-events-none opacity-[0.4]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Gold foil border frame */}
          <GoldBorder className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 } as React.CSSProperties} />

          {/* Inner gold hairline frame */}
          <div
            className="absolute inset-4 rounded-[4px] pointer-events-none"
            style={{ border: "1px solid rgba(201,168,92,0.3)", zIndex: 1 }}
          />

          {/* ===== ENVELOPE FLAPS (portrait: top is triangular, sides are narrow) ===== */}

          {/* Bottom flap (folds down, behind everything) */}
          <div
            className="flap flap-bottom"
            style={{
              bottom: 0, left: 0, right: 0, height: "45%",
              background: flapFaceDark,
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              transform: flapsOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: 1,
              boxShadow: "inset 0 2px 12px rgba(168,134,63,0.15)",
            }}
          />

          {/* Left flap */}
          <div
            className="flap flap-left"
            style={{
              top: 0, left: 0, bottom: 0, width: "42%",
              background: flapFace,
              clipPath: "polygon(0 0, 100% 35%, 0 100%)",
              transform: flapsOpen ? "rotateY(-120deg)" : "rotateY(0deg)",
              zIndex: 2,
              boxShadow: "inset -3px 0 12px rgba(168,134,63,0.1)",
            }}
          />

          {/* Right flap */}
          <div
            className="flap flap-right"
            style={{
              top: 0, right: 0, bottom: 0, width: "42%",
              background: flapFace,
              clipPath: "polygon(100% 0, 0 35%, 100% 100%)",
              transform: flapsOpen ? "rotateY(120deg)" : "rotateY(0deg)",
              zIndex: 2,
              boxShadow: "inset 3px 0 12px rgba(168,134,63,0.1)",
            }}
          />

          {/* Top flap (largest, folds back — this is the main flap you open) */}
          <div
            className="flap flap-top overflow-hidden"
            style={{
              top: 0, left: 0, right: 0, height: "55%",
              background: flapFace,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transform: flapsOpen ? "rotateX(-175deg)" : "rotateX(0deg)",
              zIndex: 3,
              boxShadow: "inset 0 -3px 14px rgba(168,134,63,0.15)",
              borderBottom: "1.5px solid rgba(201,168,92,0.5)",
            }}
          >
            {/* Filigree corners on top flap */}
            <Flourish className="absolute top-2 left-2" size={50} />
            <Flourish className="absolute top-2 right-2" size={50} style={{ transform: "scaleX(-1)" }} />

            {/* Decorative monogram watermark on flap */}
            <div
              className="absolute left-1/2 top-[35%] -translate-x-1/2 font-script pointer-events-none"
              style={{
                fontSize: "clamp(2rem, 8vw, 3rem)",
                color: "rgba(201,168,92,0.15)",
              }}
              aria-hidden
            >
              {monogram}
            </div>
          </div>

          {/* ===== WAX SEAL ===== */}
          <AnimatePresence>
            {!sealBroken && (
              <motion.button
                onClick={openEnvelope}
                className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center"
                style={{
                  width: "clamp(76px, 24vw, 108px)",
                  height: "clamp(76px, 24vw, 108px)",
                  background:
                    "radial-gradient(circle at 34% 28%, #FFF5D6 0%, #E6CE88 18%, #C9A85C 45%, #A8863F 72%, #8A6D2F 90%, #6B5524 100%)",
                  boxShadow:
                    "0 10px 28px rgba(108,85,36,0.5), inset 0 -5px 10px rgba(80,60,20,0.45), inset 0 5px 10px rgba(255,248,225,0.5), 0 0 0 3px rgba(168,134,63,0.15)",
                  zIndex: 8,
                  overflow: "hidden",
                }}
                initial={{ scale: 0, opacity: 0, rotate: -25 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.4, opacity: 0, rotate: 15 }}
                transition={{ type: "spring", damping: 14, stiffness: 180 }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                aria-label="Tap to open your invitation"
              >
                {/* Pulsing glow rings */}
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-12px",
                    border: "2px solid rgba(201,168,92,0.5)",
                    animation: "pulseRing 2.4s ease-out infinite",
                  }}
                />
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-12px",
                    border: "1.5px solid rgba(201,168,92,0.3)",
                    animation: "pulseRing 2.4s ease-out infinite 0.8s",
                  }}
                />
                {/* Notched seal edge */}
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{ inset: "6px", border: "1.5px dashed rgba(80,60,20,0.4)" }}
                />
                {/* Specular highlight */}
                <span
                  className="absolute rounded-full bg-white/50 blur-[6px]"
                  style={{ width: "36%", height: "36%", top: "14%", left: "16%" }}
                />
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.5) 48%, transparent 62%)",
                    backgroundSize: "200% 100%",
                    animation: "sealShimmer 3s ease-in-out infinite",
                  }}
                />
                {/* Monogram */}
                <span
                  className="relative font-script text-white"
                  style={{
                    fontSize: "clamp(1.3rem, 5.5vw, 2rem)",
                    textShadow: "0 1px 3px rgba(74,60,36,0.7), 0 0 8px rgba(201,168,92,0.4)",
                  }}
                >
                  {monogram}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* ===== INNER GLOW (visible when flaps open, before card emerges) ===== */}
          <AnimatePresence>
            {flapsOpen && !showInvitationCard && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: "60%",
                  height: "40%",
                  background:
                    "radial-gradient(ellipse, rgba(255,253,247,0.9) 0%, rgba(230,206,136,0.5) 40%, transparent 70%)",
                  zIndex: 5,
                  filter: "blur(8px)",
                }}
              />
            )}
          </AnimatePresence>

          {/* ===== EMERGING INVITATION CARD ===== */}
          <AnimatePresence>
            {showInvitationCard && (
              <motion.div
                className="absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center text-center px-6 rounded-[8px]"
                initial={{ y: "20%", scale: 0.85, opacity: 0 }}
                animate={{ y: "-90%", scale: 1.15, opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.2, 0.7, 1] }}
                style={{
                  zIndex: 7,
                  background: paperFace,
                  border: goldEdge,
                  boxShadow: "0 20px 60px rgba(138,109,47,0.3)",
                }}
              >
                <GoldBorder className="absolute inset-0 w-full h-full pointer-events-none" />
                <div className="absolute inset-4 rounded-[4px] pointer-events-none" style={{ border: "1px solid rgba(201,168,92,0.3)" }} />

                <Flourish className="absolute top-3 left-3" size={40} />
                <Flourish className="absolute top-3 right-3" size={40} style={{ transform: "scaleX(-1)" }} />
                <Flourish className="absolute bottom-3 left-3" size={40} style={{ transform: "scaleY(-1)" }} />
                <Flourish className="absolute bottom-3 right-3" size={40} style={{ transform: "scale(-1)" }} />

                <p className="uppercase tracking-[0.35em] text-gold-dark text-[9px] md:text-xs mb-2">
                  Together with their families
                </p>
                <p className="font-script text-gold-foil text-3xl md:text-5xl leading-tight">
                  {weddingData.couple.bride}
                </p>
                <p className="font-script text-gold text-2xl md:text-4xl my-1">&</p>
                <p className="font-script text-gold-foil text-3xl md:text-5xl leading-tight">
                  {weddingData.couple.groom}
                </p>
                <div className="section-divider my-3" aria-hidden>
                  <span className="text-gold text-xs">✦</span>
                </div>
                <p className="font-serif-text italic text-text-secondary text-sm md:text-base">
                  {weddingData.date.display}
                </p>
                <p className="text-text-muted text-[10px] md:text-xs mt-2 tracking-wider">
                  {weddingData.venues.ceremony.name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ===== TAP-TO-OPEN CTA ===== */}
      <AnimatePresence>
        {state === "sealed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative z-10 mt-6 flex flex-col items-center gap-1.5"
          >
            <div className="section-divider w-36" aria-hidden>
              <span className="text-gold text-xs">✦</span>
            </div>
            <p className="font-script text-gold-dark text-lg md:text-2xl">
              Tap the seal to open
            </p>
            <motion.p
              className="text-gold/60 text-xs uppercase tracking-[0.3em] mt-1"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your invitation awaits
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
