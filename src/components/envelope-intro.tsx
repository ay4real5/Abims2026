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
   HAPTIC
   ═══════════════════════════════════════════════════════════ */
function haptic(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {}
}

/* ═══════════════════════════════════════════════════════════
   SVG DEFS — all filters and gradients for photorealistic paper
   ═══════════════════════════════════════════════════════════ */
function SvgDefs() {
  return (
    <defs>
      {/* === Paper base color gradient === */}
      <linearGradient id="paperBody" x1="0%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%" stopColor="#E8DFC8" />
        <stop offset="30%" stopColor="#DDD0B4" />
        <stop offset="65%" stopColor="#CDBE9C" />
        <stop offset="100%" stopColor="#B8A682" />
      </linearGradient>

      <linearGradient id="paperFlap" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#E2D6BC" />
        <stop offset="40%" stopColor="#D4C5A4" />
        <stop offset="80%" stopColor="#BEAE88" />
        <stop offset="100%" stopColor="#A89870" />
      </linearGradient>

      <linearGradient id="paperFlapBack" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#D4C5A4" />
        <stop offset="50%" stopColor="#C4B290" />
        <stop offset="100%" stopColor="#AE9C72" />
      </linearGradient>

      <linearGradient id="paperInterior" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C4B290" />
        <stop offset="40%" stopColor="#B8A678" />
        <stop offset="100%" stopColor="#A6966A" />
      </linearGradient>

      <linearGradient id="paperCard" x1="10%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#F5EEDC" />
        <stop offset="40%" stopColor="#EDE3CC" />
        <stop offset="100%" stopColor="#E0D3B6" />
      </linearGradient>

      <linearGradient id="paperPocketL" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#E2D6BC" />
        <stop offset="55%" stopColor="#D0C0A0" />
        <stop offset="100%" stopColor="#BCAA82" />
      </linearGradient>

      <linearGradient id="paperPocketR" x1="100%" y1="0%" x2="0%" y2="50%">
        <stop offset="0%" stopColor="#E2D6BC" />
        <stop offset="55%" stopColor="#D0C0A0" />
        <stop offset="100%" stopColor="#BCAA82" />
      </linearGradient>

      <linearGradient id="paperPocketB" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#DDD0B4" />
        <stop offset="52%" stopColor="#C8B898" />
        <stop offset="100%" stopColor="#B8A67E" />
      </linearGradient>

      {/* === Gold foil gradient === */}
      <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="30%">
        <stop offset="0%" stopColor="#A8863F" />
        <stop offset="25%" stopColor="#E6CE88" />
        <stop offset="50%" stopColor="#FBF3E2" />
        <stop offset="70%" stopColor="#D4B876" />
        <stop offset="100%" stopColor="#A8863F" />
      </linearGradient>

      {/* === Wax seal gradient === */}
      <radialGradient id="waxGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#C9A050" />
        <stop offset="20%" stopColor="#A87D30" />
        <stop offset="45%" stopColor="#8A6225" />
        <stop offset="70%" stopColor="#6B4A1A" />
        <stop offset="90%" stopColor="#4A3215" />
        <stop offset="100%" stopColor="#3A2810" />
      </radialGradient>

      <radialGradient id="waxSpecular" cx="32%" cy="28%" r="30%">
        <stop offset="0%" stopColor="rgba(255,230,170,0.6)" />
        <stop offset="60%" stopColor="rgba(255,230,170,0.15)" />
        <stop offset="100%" stopColor="rgba(255,230,170,0)" />
      </radialGradient>

      {/* === Paper noise texture === */}
      <filter id="paperNoise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise" />
        <feColorMatrix in="noise" values="0 0 0 0 0.82  0 0 0 0 0.74  0 0 0 0 0.56  0 0 0 0.12 0" result="colored" />
        <feComposite in="colored" in2="SourceGraphic" operator="in" result="masked" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="masked" />
        </feMerge>
      </filter>

      {/* === Paper 3D lighting (specular) === */}
      <filter id="paperLight" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="bumpMap" />
        <feSpecularLighting in="bumpMap" surfaceScale="3" specularConstant="0.6" specularExponent="20" lightingColor="#FFF5DC" result="specular">
          <fePointLight x="80" y="40" z="120" />
        </feSpecularLighting>
        <feComposite in="specular" in2="SourceAlpha" operator="in" result="specMasked" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="specMasked" />
        </feMerge>
      </filter>

      {/* === Soft drop shadow === */}
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
        <feOffset in="blur" dx="0" dy="8" result="offsetBlur" />
        <feComponentTransfer in="offsetBlur" result="shadow">
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* === Heavy ambient shadow === */}
      <filter id="ambientShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="blur" />
        <feOffset in="blur" dx="0" dy="30" result="offsetBlur" />
        <feComponentTransfer in="offsetBlur" result="shadow">
          <feFuncA type="linear" slope="0.35" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* === Flap edge warp (slightly non-geometric) === */}
      <filter id="edgeWarp" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* === Fold crease shadow === */}
      <linearGradient id="creaseShadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
        <stop offset="50%" stopColor="rgba(0,0,0,0.04)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </linearGradient>

      {/* === Card gold border === */}
      <linearGradient id="borderGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(168,134,63,0.35)" />
        <stop offset="50%" stopColor="rgba(212,184,118,0.5)" />
        <stop offset="100%" stopColor="rgba(168,134,63,0.35)" />
      </linearGradient>
    </defs>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENVELOPE BODY SVG — back + interior + pockets with fold creases
   ═══════════════════════════════════════════════════════════ */
function EnvelopeBodySVG() {
  return (
    <svg
      viewBox="0 0 300 400"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      {/* === Envelope back (full rect) === */}
      <rect
        x="6" y="6" width="288" height="388"
        rx="3" ry="3"
        fill="url(#paperBody)"
        filter="url(#paperNoise)"
      />

      {/* Studio lighting overlay — warm light from top-left */}
      <rect
        x="6" y="6" width="288" height="388"
        rx="3" ry="3"
        fill="url(#waxSpecular)"
        opacity="0.3"
      />

      {/* === Interior (darker, visible when flap opens) === */}
      <rect
        x="14" y="14" width="272" height="372"
        rx="2" ry="2"
        fill="url(#paperInterior)"
        filter="url(#paperNoise)"
        opacity="0.95"
      />

      {/* Interior shadow at top (from flap opening) */}
      <rect
        x="14" y="14" width="272" height="60"
        rx="2"
        fill="url(#creaseShadow)"
      />

      {/* === Bottom pocket (triangle with slightly curved edges) === */}
      <path
        d="M 14 392 Q 150 200 286 392 Z"
        fill="url(#paperPocketB)"
        filter="url(#paperNoise)"
      />
      {/* Bottom pocket fold crease — subtle shadow along the V */}
      <path
        d="M 14 392 Q 150 200 286 392"
        fill="none"
        stroke="rgba(80,60,25,0.08)"
        strokeWidth="1.5"
      />
      {/* Bottom pocket inner highlight */}
      <path
        d="M 20 388 Q 150 208 280 388"
        fill="none"
        stroke="rgba(255,245,220,0.12)"
        strokeWidth="0.8"
      />

      {/* === Left pocket === */}
      <path
        d="M 14 14 Q 150 200 14 392 Z"
        fill="url(#paperPocketL)"
        filter="url(#paperNoise)"
      />
      <path
        d="M 14 14 Q 150 200 14 392"
        fill="none"
        stroke="rgba(80,60,25,0.06)"
        strokeWidth="1"
      />

      {/* === Right pocket === */}
      <path
        d="M 286 14 Q 150 200 286 392 Z"
        fill="url(#paperPocketR)"
        filter="url(#paperNoise)"
      />
      <path
        d="M 286 14 Q 150 200 286 392"
        fill="none"
        stroke="rgba(80,60,25,0.06)"
        strokeWidth="1"
      />

      {/* === Center V shadow (where all pockets meet) === */}
      <path
        d="M 14 14 Q 150 200 286 14 M 14 392 Q 150 200 286 392"
        fill="none"
        stroke="rgba(70,50,20,0.05)"
        strokeWidth="2"
        filter="url(#paperNoise)"
      />

      {/* === Wax seal attachment shadow on paper === */}
      <ellipse
        cx="150" cy="200"
        rx="42" ry="42"
        fill="rgba(60,40,15,0.12)"
        filter="url(#softShadow)"
        opacity="0.5"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENVELOPE FLAP SVG — front and back faces
   ═══════════════════════════════════════════════════════════ */
function EnvelopeFlapSVG({ monogram }: { monogram: string }) {
  return (
    <svg
      viewBox="0 0 300 200"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      aria-hidden
    >
      {/* === Flap front face (triangle with curved bottom edge) === */}
      <path
        d="M 6 6 L 294 6 Q 150 205 6 6 Z"
        fill="url(#paperFlap)"
        filter="url(#edgeWarp) url(#paperNoise)"
      />

      {/* Flap specular lighting overlay */}
      <path
        d="M 6 6 L 294 6 Q 150 205 6 6 Z"
        fill="url(#waxSpecular)"
        opacity="0.25"
      />

      {/* Flap bottom edge highlight (where it meets body) */}
      <path
        d="M 10 8 Q 150 200 290 8"
        fill="none"
        stroke="rgba(255,245,220,0.3)"
        strokeWidth="1"
      />
      <path
        d="M 10 10 Q 150 202 290 10"
        fill="none"
        stroke="rgba(100,80,40,0.1)"
        strokeWidth="0.5"
      />

      {/* Gold foil monogram watermark on flap */}
      <text
        x="150" y="80"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="28"
        fill="url(#goldFoil)"
        opacity="0.15"
      >
        {monogram}
      </text>

      {/* Flap fold crease at top */}
      <line
        x1="6" y1="6" x2="294" y2="6"
        stroke="rgba(100,80,40,0.15)"
        strokeWidth="1"
      />
    </svg>
  );
}

function EnvelopeFlapBackSVG() {
  return (
    <svg
      viewBox="0 0 300 200"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", backfaceVisibility: "hidden" }}
      aria-hidden
    >
      <path
        d="M 6 6 L 294 6 Q 150 205 6 6 Z"
        fill="url(#paperFlapBack)"
        filter="url(#edgeWarp) url(#paperNoise)"
      />
      <path
        d="M 6 6 L 294 6 Q 150 205 6 6 Z"
        fill="url(#waxSpecular)"
        opacity="0.15"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   WAX SEAL SVG — photorealistic with imperfections
   ═══════════════════════════════════════════════════════════ */
function WaxSealSVG({
  cracking,
  monogram,
}: {
  cracking: boolean;
  monogram: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      {/* Wax body with irregular edge */}
      <circle
        cx="50" cy="50" r="46"
        fill="url(#waxGrad)"
        filter="url(#edgeWarp)"
      />

      {/* Specular highlight */}
      <ellipse
        cx="36" cy="32" rx="16" ry="12"
        fill="url(#waxSpecular)"
      />

      {/* Imperfection ring — dashed circle for irregular edge */}
      <circle
        cx="50" cy="50" r="45"
        fill="none"
        stroke="rgba(60,40,15,0.12)"
        strokeWidth="0.5"
        strokeDasharray="2 1.5 1 2 3 1 0.5 2"
      />

      {/* Inner ring — pressed edge */}
      <circle
        cx="50" cy="50" r="38"
        fill="none"
        stroke="rgba(40,25,8,0.2)"
        strokeWidth="0.8"
      />

      {/* Crack lines */}
      <AnimatePresence>
        {cracking && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M50 8 L44 30 L53 47 L38 67 L47 92"
              stroke="rgba(30,18,5,0.7)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
            <motion.path
              d="M50 8 L58 27 L49 43 L63 61 L54 88"
              stroke="rgba(30,18,5,0.55)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
            />
            <motion.path
              d="M50 26 L34 40 L41 52"
              stroke="rgba(30,18,5,0.45)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: 0.1 }}
            />
            <motion.path
              d="M50 26 L68 38 L59 51"
              stroke="rgba(30,18,5,0.45)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: 0.12 }}
            />
          </motion.g>
        )}
      </AnimatePresence>

      {/* Monogram — gold foil pressed into wax */}
      <text
        x="50" y="58"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="22"
        fill="url(#goldFoil)"
        style={{
          filter: "drop-shadow(0 1px 1px rgba(30,18,5,0.6))",
        }}
      >
        {monogram}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   INVITATION CARD SVG — designed stationery piece
   ═══════════════════════════════════════════════════════════ */
function InvitationCardSVG({
  bride,
  groom,
  dateDisplay,
  venueName,
  monogram,
}: {
  bride: string;
  groom: string;
  dateDisplay: string;
  venueName: string;
  monogram: string;
}) {
  return (
    <svg
      viewBox="0 0 240 320"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      {/* Card background */}
      <rect x="2" y="2" width="236" height="316" rx="2" fill="url(#paperCard)" filter="url(#paperNoise)" />

      {/* Studio lighting */}
      <rect x="2" y="2" width="236" height="316" rx="2" fill="url(#waxSpecular)" opacity="0.2" />

      {/* Gold border — outer */}
      <rect x="10" y="10" width="220" height="300" rx="1" fill="none" stroke="url(#borderGold)" strokeWidth="1" />

      {/* Gold border — inner */}
      <rect x="14" y="14" width="212" height="292" rx="1" fill="none" stroke="rgba(168,134,63,0.18)" strokeWidth="0.5" />

      {/* Corner ornaments */}
      {[
        { x: 10, y: 10, rotate: 0 },
        { x: 230, y: 10, rotate: 90 },
        { x: 230, y: 310, rotate: 180 },
        { x: 10, y: 310, rotate: 270 },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.rotate})`}>
          <path d="M 0 8 L 0 0 L 8 0" fill="none" stroke="url(#borderGold)" strokeWidth="0.8" />
          <circle cx="3" cy="3" r="1" fill="url(#goldFoil)" opacity="0.6" />
        </g>
      ))}

      {/* "Together with their families" */}
      <text
        x="120" y="80"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="7"
        fill="#988A76"
        letterSpacing="2.5"
      >
        TOGETHER WITH THEIR FAMILIES
      </text>

      {/* Bride name — script */}
      <text
        x="120" y="130"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="30"
        fill="url(#goldFoil)"
      >
        {bride}
      </text>

      {/* Ampersand */}
      <text
        x="120" y="160"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="20"
        fill="#B08D3F"
      >
        &amp;
      </text>

      {/* Groom name — script */}
      <text
        x="120" y="195"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="30"
        fill="url(#goldFoil)"
      >
        {groom}
      </text>

      {/* Divider */}
      <g transform="translate(120 215)">
        <line x1="-32" y1="0" x2="-6" y2="0" stroke="rgba(168,134,63,0.35)" strokeWidth="0.8" />
        <text x="0" y="3" textAnchor="middle" fontSize="8" fill="#B08D3F">✦</text>
        <line x1="6" y1="0" x2="32" y2="0" stroke="rgba(168,134,63,0.35)" strokeWidth="0.8" />
      </g>

      {/* Date */}
      <text
        x="120" y="240"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="12"
        fill="#6E6252"
      >
        {dateDisplay}
      </text>

      {/* Venue */}
      <text
        x="120" y="262"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="8"
        fill="#988A76"
        letterSpacing="0.5"
      >
        {venueName}
      </text>

      {/* Monogram at bottom */}
      <text
        x="120" y="290"
        textAnchor="middle"
        fontFamily="'Great Vibes', cursive"
        fontSize="14"
        fill="url(#goldFoil)"
        opacity="0.5"
      >
        {monogram}
      </text>
    </svg>
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

  useEffect(() => {
    const t = setTimeout(() => setPhase("sealed"), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const addTimer = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
  };

  const openEnvelope = useCallback(() => {
    if (phase !== "sealed") return;

    setPhase("cracking");
    haptic(25);
    playSound("wax-crack", 0.6);
    setSealCracking(true);

    addTimer(() => {
      haptic([12, 15, 12]);
      setSealGone(true);
    }, 600);

    addTimer(() => {
      setPhase("opening");
      playSound("paper-unfold", 0.45);
      haptic(15);
      setFlapOpen(true);
    }, 900);

    addTimer(() => {
      playSound("paper-unfold", 0.3);
      setCardOut(true);
    }, 2200);

    addTimer(() => {
      haptic([8, 20, 8]);
      playSound("chime", 0.4);
      startMusic();
      setEnvelopeGone(true);
      setPhase("revealed");
    }, 3400);

    addTimer(() => setShowScrollHint(true), 4200);

    addTimer(() => onOpen(), 4600);
  }, [phase, playSound, startMusic, onOpen]);

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
      {/* Hidden SVG defs — available to all child SVGs */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden>
        <SvgDefs />
      </svg>

      {/* Ambient vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 75% 55% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Ambient particles */}
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

      {/* ═══ ENVELOPE SCENE ═══ */}
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
            {/* Idle floating */}
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
              {/* ════ Envelope body + pockets (SVG) ════ */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "3px",
                  filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.3)) drop-shadow(0 18px 45px rgba(0,0,0,0.35)) drop-shadow(0 50px 100px rgba(0,0,0,0.5))",
                  transformStyle: "preserve-3d",
                  overflow: "hidden",
                }}
              >
                <EnvelopeBodySVG />

                {/* ════ Invitation card (clipped, slides up) ════ */}
                <div
                  style={{
                    position: "absolute",
                    left: "12%",
                    right: "12%",
                    bottom: "4%",
                    top: "20%",
                    overflow: "hidden",
                    borderRadius: "2px",
                    zIndex: 2,
                  }}
                >
                  <motion.div
                    animate={{
                      y: cardOut ? "-65%" : "0%",
                      scale: cardOut ? 1.04 : 1,
                    }}
                    transition={{
                      duration: cardOut ? 1.2 : 1,
                      ease: EASE_HEAVY,
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      filter: cardOut
                        ? "drop-shadow(0 20px 40px rgba(0,0,0,0.3))"
                        : "none",
                      transformOrigin: "bottom center",
                    }}
                  >
                    <InvitationCardSVG
                      bride={bride}
                      groom={groom}
                      dateDisplay={dateDisplay}
                      venueName={venueName}
                      monogram={monogram}
                    />
                  </motion.div>
                </div>

                {/* ════ Top flap (3D rotate) ════ */}
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
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    zIndex: 5,
                    filter: flapOpen
                      ? "drop-shadow(0 10px 16px rgba(0,0,0,0.25))"
                      : "none",
                    willChange: "transform",
                  }}
                >
                  {/* Front face */}
                  <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                    <EnvelopeFlapSVG monogram={monogram} />
                  </div>
                  {/* Back face (visible when rotated past 90deg) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                    }}
                  >
                    <EnvelopeFlapBackSVG />
                  </div>
                </motion.div>

                {/* ════ Wax seal (tappable) ════ */}
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
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        zIndex: 10,
                        filter: "drop-shadow(0 4px 8px rgba(60,40,15,0.5))",
                      }}
                    >
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
                      <WaxSealSVG cracking={sealCracking} monogram={monogram} />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Ground shadow */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "-16px",
                    transform: "translateX(-50%)",
                    width: "82%",
                    height: "24px",
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)",
                    filter: "blur(8px)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ GREETING ═══ */}
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

      {/* ═══ SCROLL HINT ═══ */}
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
