"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio-manager";
import { useGuestName } from "@/lib/use-guest-name";
import { weddingData } from "@/lib/wedding-data";

type EnvelopeState = "sealed" | "opening" | "open" | "closing";

/* Ornate gold corner flourish */
function Flourish({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="70" height="70" viewBox="0 0 70 70" fill="none" aria-hidden>
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

export default function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  const { playSound } = useAudio();
  const guestName = useGuestName();
  const [state, setState] = useState<EnvelopeState>("sealed");
  const [sealBroken, setSealBroken] = useState(false);
  const [flapsOpen, setFlapsOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const openEnvelope = useCallback(() => {
    if (state === "opening" || state === "open") return;
    setState("opening");

    playSound("seal-pop", 0.6);
    setSealBroken(true);

    setTimeout(() => playSound("paper-unfold", 0.4), 200);
    setTimeout(() => setFlapsOpen(true), 250);

    setTimeout(() => {
      playSound("chime", 0.5);
      setContentVisible(true);
      setState("open");
    }, 900);

    setTimeout(() => onOpen(), 1400);
  }, [state, playSound, onOpen]);

  const closeEnvelope = useCallback(() => {
    if (state === "closing" || state === "sealed") return;
    setState("closing");
    setContentVisible(false);
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

  const paperFace = "linear-gradient(150deg, #FFFDF7 0%, #FAF6EC 45%, #F3E4C4 100%)";
  const flapFace = "linear-gradient(160deg, #FBF3E2 0%, #F3E4C4 60%, #E7D2A6 100%)";
  const goldEdge = "1px solid rgba(201,168,92,0.55)";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 py-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 90% at 50% 30%, #FFFDF7 0%, #FAF6EC 45%, #F2EAD6 80%, #E4D8BC 100%)",
      }}
    >
      {/* Soft ambient glow behind envelope */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "min(680px, 96vw)",
          height: "min(680px, 96vw)",
          background:
            "radial-gradient(circle, rgba(201,168,92,0.22) 0%, rgba(201,168,92,0.08) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              background: "radial-gradient(circle, #E6CE88, rgba(201,168,92,0))",
              animation: `floatUp ${16 + (i % 5) * 4}s linear infinite`,
              animationDelay: `${-i * 2.2}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Greeting */}
      <AnimatePresence>
        {state === "sealed" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative z-10 text-center mb-7"
          >
            {guestName && (
              <p className="font-script text-gold-dark text-2xl md:text-3xl mb-1">
                Dear {guestName},
              </p>
            )}
            <p className="uppercase tracking-[0.5em] text-gold-dark text-[11px] md:text-sm font-medium">
              You&apos;re Invited
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Envelope */}
      <div
        className="envelope-container relative z-10"
        style={{ width: "min(560px, 92vw)", aspectRatio: "3 / 2" }}
      >
        <div
          className="envelope-3d relative w-full h-full rounded-[6px]"
          style={{ background: paperFace, boxShadow: "var(--shadow-envelope)", border: goldEdge }}
        >
          {/* Fine paper grain */}
          <div
            className="absolute inset-0 rounded-[6px] pointer-events-none opacity-[0.5]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Inner gold hairline frame */}
          <div
            className="absolute inset-3 rounded-[3px] pointer-events-none"
            style={{ border: "1px solid rgba(201,168,92,0.35)", zIndex: 1 }}
          />

          {/* Bottom flap */}
          <div
            className="flap flap-bottom"
            style={{
              bottom: 0, left: 0, right: 0, height: "60%",
              background: flapFace,
              clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
              transform: flapsOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              zIndex: 1,
              boxShadow: "inset 0 2px 10px rgba(168,134,63,0.12)",
            }}
          />
          {/* Left flap */}
          <div
            className="flap flap-left"
            style={{
              top: 0, left: 0, bottom: 0, width: "50%",
              background: flapFace,
              clipPath: "polygon(0 0, 100% 50%, 0 100%)",
              transform: flapsOpen ? "rotateY(-115deg)" : "rotateY(0deg)",
              zIndex: 2,
              boxShadow: "inset -2px 0 10px rgba(168,134,63,0.08)",
            }}
          />
          {/* Right flap */}
          <div
            className="flap flap-right"
            style={{
              top: 0, right: 0, bottom: 0, width: "50%",
              background: flapFace,
              clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
              transform: flapsOpen ? "rotateY(115deg)" : "rotateY(0deg)",
              zIndex: 2,
              boxShadow: "inset 2px 0 10px rgba(168,134,63,0.08)",
            }}
          />
          {/* Top flap with filigree + gold edge */}
          <div
            className="flap flap-top overflow-hidden"
            style={{
              top: 0, left: 0, right: 0, height: "60%",
              background: flapFace,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transform: flapsOpen ? "rotateX(-180deg)" : "rotateX(0deg)",
              zIndex: 3,
              boxShadow: "inset 0 -2px 12px rgba(168,134,63,0.12)",
              borderBottom: "1px solid rgba(201,168,92,0.4)",
            }}
          >
            <Flourish className="absolute top-1 left-1" />
            <Flourish className="absolute top-1 right-1" style={{ transform: "scaleX(-1)" }} />
          </div>

          {/* Wax Seal */}
          <AnimatePresence>
            {!sealBroken && (
              <motion.button
                onClick={openEnvelope}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer flex items-center justify-center"
                style={{
                  width: "clamp(72px, 22vw, 104px)",
                  height: "clamp(72px, 22vw, 104px)",
                  background:
                    "radial-gradient(circle at 34% 30%, #F3E4C4 0%, #E6CE88 22%, #C9A85C 55%, #A8863F 80%, #8A6D2F 100%)",
                  boxShadow:
                    "0 8px 22px rgba(138,109,47,0.45), inset 0 -4px 8px rgba(90,70,25,0.4), inset 0 4px 8px rgba(255,248,225,0.5)",
                  zIndex: 6,
                  overflow: "hidden",
                }}
                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.25, opacity: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Tap to open your invitation"
              >
                {/* Pulsing glow ring */}
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-10px",
                    border: "2px solid rgba(201,168,92,0.5)",
                    animation: "pulseRing 2.4s ease-out infinite",
                  }}
                />
                {/* Notched seal edge */}
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{ inset: "5px", border: "1.5px dashed rgba(90,70,25,0.35)" }}
                />
                {/* Highlight */}
                <span
                  className="absolute rounded-full bg-white/40 blur-[5px]"
                  style={{ width: "34%", height: "34%", top: "16%", left: "18%" }}
                />
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.45) 50%, transparent 65%)",
                    backgroundSize: "200% 100%",
                    animation: "sealShimmer 3.2s ease-in-out infinite",
                  }}
                />
                {/* Monogram */}
                <span
                  className="relative font-script text-white"
                  style={{
                    fontSize: "clamp(1.25rem, 5vw, 1.9rem)",
                    textShadow: "0 1px 2px rgba(74,60,36,0.6)",
                  }}
                >
                  {monogram}
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Revealed content */}
          <AnimatePresence>
            {contentVisible && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                style={{ zIndex: 7 }}
              >
                <p className="uppercase tracking-[0.35em] text-gold-dark text-[10px] md:text-xs">
                  We&apos;re Getting Married
                </p>
                <p className="font-script text-gold-foil text-4xl md:text-6xl mt-1">
                  {weddingData.couple.shortNames}
                </p>
                <p className="font-serif-text italic text-text-secondary text-sm md:text-base mt-2">
                  {weddingData.date.display}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tap-to-open CTA */}
      <AnimatePresence>
        {state === "sealed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative z-10 mt-9 flex flex-col items-center gap-1.5"
          >
            <div className="section-divider w-40" aria-hidden>
              <span className="text-gold text-xs">✦</span>
            </div>
            <p className="font-script text-gold-dark text-xl md:text-2xl">
              Tap the seal to open
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
