"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

/**
 * The wax seal — the only interactive object on the first screen.
 * Sealed: breathes gently. On tap: haptic tick, the wax fractures in two,
 * gold dust scatters, and the halves fall away.
 *
 * viewBox is a 300×300 window centred on the seal's original coordinates
 * (350, 313) inside the 700×500 envelope, so the artwork carries over 1:1.
 */

const PARTICLES = [
  { dx: -44, dy: -30, r: 3.2, delay: 0 },
  { dx: 38, dy: -44, r: 2.4, delay: 0.03 },
  { dx: 56, dy: -8, r: 2.8, delay: 0.06 },
  { dx: -58, dy: 6, r: 2.2, delay: 0.02 },
  { dx: -30, dy: 44, r: 2.6, delay: 0.08 },
  { dx: 34, dy: 40, r: 3, delay: 0.05 },
  { dx: 6, dy: -56, r: 2, delay: 0.1 },
];

type Props = {
  cracked: boolean;
  onOpen: () => void;
  className?: string;
  style?: React.CSSProperties;
};

export default function Seal({ cracked, onOpen, className, style }: Props) {
  const reduced = useReducedMotion();

  const sealArt = (
    <>
      {/* first pour — thin spill under the main blob */}
      <path
        d="M 424 316 C 428 293 419 272 402 258 C 385 245 367 240 348 241 C 328 242 310 249 296 262 C 281 276 273 294 274 314 C 275 334 281 352 295 365 C 308 377 327 386 349 386 C 371 386 390 379 404 366 C 417 354 421 336 424 316 Z"
        fill="url(#sl-spill)"
        opacity="0.9"
        transform="rotate(8 350 316)"
      />
      {/* main blob */}
      <path
        d="M 416 314 C 419 292 409 271 391 258 C 376 247 362 244 349 244 C 333 243 319 249 306 259 C 290 271 283 288 284 308 C 285 327 290 344 304 357 C 317 369 333 376 350 375 C 369 374 385 368 398 354 C 409 342 413 329 416 314 Z"
        fill="url(#sl-body)"
        stroke="rgba(46,29,10,0.45)"
        strokeWidth="1"
      />
      {/* die impression */}
      <circle cx="350" cy="311" r="44" fill="rgba(40,24,7,0.18)" />
      <circle cx="350" cy="311" r="44" fill="none" stroke="rgba(250,228,178,0.35)" strokeWidth="1.4" />
      <circle cx="350" cy="311" r="39" fill="none" stroke="rgba(46,29,10,0.3)" strokeWidth="0.8" />
      {/* monogram — embossed */}
      <text
        x="350" y="313" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-serif), Georgia, serif" fontSize="36" fontStyle="italic"
        fontWeight="600" letterSpacing="2" fill="rgba(40,23,6,0.9)" dy="2"
      >
        {site.initials[0]}&amp;{site.initials[1]}
      </text>
      <text
        x="350" y="313" textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-serif), Georgia, serif" fontSize="36" fontStyle="italic"
        fontWeight="600" letterSpacing="2" fill="url(#sl-gold)"
      >
        {site.initials[0]}&amp;{site.initials[1]}
      </text>
      {/* specular catch */}
      <ellipse
        cx="322" cy="276" rx="28" ry="12" fill="#fff6dd" opacity="0.3"
        filter="url(#sl-blur)" transform="rotate(-24 322 276)"
      />
    </>
  );

  return (
    <motion.button
      type="button"
      onPointerUp={onOpen}
      onClick={onOpen}
      disabled={cracked}
      aria-label="Break the seal and open the invitation"
      className={className}
      style={{ display: "block", border: 0, padding: 0, background: "transparent", cursor: cracked ? "default" : "pointer", touchAction: "manipulation", ...style, WebkitTapHighlightColor: "transparent" }}
      whileTap={cracked ? undefined : { scale: 0.93 }}
    >
      <motion.svg
        viewBox="200 163 300 300"
        className="block h-auto w-full overflow-visible"
        animate={cracked || reduced ? { scale: 1 } : { scale: [1, 1.028, 1] }}
        transition={{ duration: 4.8, repeat: cracked || reduced ? 0 : Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id="sl-body" cx="0.4" cy="0.34" r="0.8">
            <stop offset="0" stopColor="#c2934c" />
            <stop offset="0.5" stopColor="#96703a" />
            <stop offset="0.85" stopColor="#6e4e26" />
            <stop offset="1" stopColor="#59391a" />
          </radialGradient>
          <radialGradient id="sl-spill" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0.7" stopColor="#7a5527" />
            <stop offset="1" stopColor="#64431d" />
          </radialGradient>
          <linearGradient id="sl-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8ecc4" />
            <stop offset="0.5" stopColor="#e3c37e" />
            <stop offset="1" stopColor="#b18a4c" />
          </linearGradient>
          <filter id="sl-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#2b1a08" floodOpacity="0.5" />
          </filter>
          <filter id="sl-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          {/* jagged fracture through the middle */}
          <clipPath id="sl-left">
            <polygon points="180,143 344,143 358,225 340,275 356,330 346,483 180,483" />
          </clipPath>
          <clipPath id="sl-right">
            <polygon points="344,143 520,143 520,483 346,483 356,330 340,275 358,225" />
          </clipPath>
        </defs>

        <g transform="rotate(-5 350 313) translate(2 1)">
          {!cracked && <g filter="url(#sl-shadow)">{sealArt}</g>}

          {cracked && (
            <>
              <motion.g
                clipPath="url(#sl-left)"
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: -18, y: 10, rotate: -7, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 1.6, ease: [0.2, 0, 0.3, 1] }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <g filter="url(#sl-shadow)">{sealArt}</g>
              </motion.g>
              <motion.g
                clipPath="url(#sl-right)"
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                animate={{ x: 20, y: 13, rotate: 8, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 1.6, ease: [0.2, 0, 0.3, 1] }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <g filter="url(#sl-shadow)">{sealArt}</g>
              </motion.g>

              {/* gold dust */}
              {!reduced &&
                PARTICLES.map((p, i) => (
                  <motion.circle
                    key={i}
                    cx="350"
                    cy="313"
                    r={p.r}
                    fill="#e3c37e"
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: [0, 1, 0], x: p.dx, y: p.dy }}
                    transition={{ duration: 1.5, delay: p.delay * 3, ease: "easeOut" }}
                  />
                ))}
            </>
          )}
        </g>
      </motion.svg>
    </motion.button>
  );
}
