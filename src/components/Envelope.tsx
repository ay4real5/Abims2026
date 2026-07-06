"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

/**
 * A closed envelope, seen from the flap side, sealed with wax.
 * Pure SVG — every flap, crease and shadow is drawn, not faked with divs.
 * viewBox is 700 × 500 (a 7:5 baronial envelope).
 */
export default function Envelope() {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 700 500"
      className="block w-full h-auto"
      role="img"
      aria-label="A sealed wedding invitation envelope"
    >
      <defs>
        {/* ── paper ─────────────────────────────────────────────── */}
        <linearGradient id="paperBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecdfc6" />
          <stop offset="1" stopColor="#ddccaa" />
        </linearGradient>
        <linearGradient id="flapTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2e8d2" />
          <stop offset="0.75" stopColor="#e5d6b6" />
          <stop offset="1" stopColor="#dbc9a5" />
        </linearGradient>
        <linearGradient id="flapBottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e9dcbf" />
          <stop offset="1" stopColor="#e0d0ae" />
        </linearGradient>
        <linearGradient id="flapLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e7dabc" />
          <stop offset="1" stopColor="#dcccaa" />
        </linearGradient>
        <linearGradient id="flapRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#e7dabc" />
          <stop offset="1" stopColor="#dcccaa" />
        </linearGradient>

        {/* ── wax ───────────────────────────────────────────────── */}
        <radialGradient id="waxBody" cx="0.4" cy="0.34" r="0.8">
          <stop offset="0" stopColor="#c2934c" />
          <stop offset="0.5" stopColor="#96703a" />
          <stop offset="0.85" stopColor="#6e4e26" />
          <stop offset="1" stopColor="#59391a" />
        </radialGradient>
        <radialGradient id="waxSpill" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0.7" stopColor="#7a5527" />
          <stop offset="1" stopColor="#64431d" />
        </radialGradient>
        <linearGradient id="goldBright" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8ecc4" />
          <stop offset="0.5" stopColor="#e3c37e" />
          <stop offset="1" stopColor="#b18a4c" />
        </linearGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0.9" gradientTransform="rotate(-12 0.5 0.5)">
          <stop offset="0" stopColor="#fffbee" stopOpacity="0" />
          <stop offset="0.22" stopColor="#fffbee" stopOpacity="0.16" />
          <stop offset="0.4" stopColor="#fffbee" stopOpacity="0" />
          <stop offset="1" stopColor="#fffbee" stopOpacity="0" />
        </linearGradient>

        {/* ── texture & shadows ─────────────────────────────────── */}
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.65 0.65 0.65 0 0"
          />
        </filter>
        <filter id="flapShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4.5" stdDeviation="5" floodColor="#4d3820" floodOpacity="0.36" />
        </filter>
        <filter id="edgeShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#5a4426" floodOpacity="0.18" />
        </filter>
        <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#2b1a08" floodOpacity="0.5" />
        </filter>
        <filter id="softBlur">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        <clipPath id="envelopeClip">
          <rect x="0" y="0" width="700" height="500" rx="10" />
        </clipPath>
      </defs>

      {/* ══ envelope body ═══════════════════════════════════════ */}
      <g clipPath="url(#envelopeClip)">
        {/* base paper */}
        <rect x="0" y="0" width="700" height="500" rx="10" fill="url(#paperBase)" />

        {/* side flaps — their diagonal fold edges catch faint shadow */}
        <path
          d="M 4 16 C 120 128 245 218 352 288 C 245 358 120 425 4 486 Z"
          fill="url(#flapLeft)"
          filter="url(#edgeShadow)"
        />
        <path
          d="M 696 16 C 580 128 455 218 348 288 C 455 358 580 425 696 486 Z"
          fill="url(#flapRight)"
          filter="url(#edgeShadow)"
        />

        {/* bottom flap */}
        <path
          d="M 2 494 C 130 424 242 356 350 304 C 458 356 570 424 698 494 Z"
          fill="url(#flapBottom)"
          filter="url(#flapShadow)"
        />
        {/* bottom flap crease highlights along its edges */}
        <path
          d="M 8 490 C 134 421 244 355 350 304"
          fill="none"
          stroke="rgba(255,248,230,0.5)"
          strokeWidth="1"
        />
        <path
          d="M 692 490 C 566 421 456 355 350 304"
          fill="none"
          stroke="rgba(255,248,230,0.5)"
          strokeWidth="1"
        />

        {/* top flap — folded down over everything */}
        <path
          d="M 2 8 L 698 8 C 652 58 500 180 350 330 C 200 180 48 58 2 8 Z"
          fill="url(#flapTop)"
          filter="url(#flapShadow)"
        />
        {/* fold crease where the flap bends over the top edge */}
        <line x1="6" y1="10" x2="694" y2="10" stroke="rgba(90,68,38,0.22)" strokeWidth="1.5" />
        <line x1="6" y1="12" x2="694" y2="12" stroke="rgba(255,250,235,0.55)" strokeWidth="0.8" />

        {/* cotton paper grain over everything */}
        <rect x="0" y="0" width="700" height="500" filter="url(#grain)" opacity="0.09" />

        {/* diagonal sheen — one soft pass of light across the paper */}
        <rect
          x="-100"
          y="-100"
          width="900"
          height="700"
          fill="url(#sheen)"
          style={{ mixBlendMode: "soft-light" }}
        />

        {/* ambient light falling from above */}
        <ellipse
          cx="350"
          cy="60"
          rx="420"
          ry="220"
          fill="#fffdf5"
          opacity="0.16"
          style={{ mixBlendMode: "soft-light" }}
        />

        {/* paper thickness on the lower edge */}
        <path
          d="M 10 498 L 690 498"
          stroke="rgba(70,52,28,0.35)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* ══ wax seal ════════════════════════════════════════════ */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reduced ? undefined : { scale: [1, 1.028, 1] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <g filter="url(#sealShadow)" transform="rotate(-5 350 313) translate(2 1)">
          {/* first pour — the thin wax spill under the main blob */}
          <path
            d="M 424 316
               C 428 293 419 272 402 258
               C 385 245 367 240 348 241
               C 328 242 310 249 296 262
               C 281 276 273 294 274 314
               C 275 334 281 352 295 365
               C 308 377 327 386 349 386
               C 371 386 390 379 404 366
               C 417 354 421 336 424 316 Z"
            fill="url(#waxSpill)"
            opacity="0.9"
            transform="rotate(8 350 316)"
          />
          {/* main wax blob — irregular, hand-poured */}
          <path
            d="M 416 314
               C 419 292 409 271 391 258
               C 376 247 362 244 349 244
               C 333 243 319 249 306 259
               C 290 271 283 288 284 308
               C 285 327 290 344 304 357
               C 317 369 333 376 350 375
               C 369 374 385 368 398 354
               C 409 342 413 329 416 314 Z"
            fill="url(#waxBody)"
            stroke="rgba(46,29,10,0.45)"
            strokeWidth="1"
          />
          {/* pressed inner disc — the die impression */}
          <circle cx="350" cy="311" r="44" fill="rgba(40,24,7,0.18)" />
          <circle
            cx="350"
            cy="311"
            r="44"
            fill="none"
            stroke="rgba(250,228,178,0.35)"
            strokeWidth="1.4"
          />
          <circle
            cx="350"
            cy="311"
            r="39"
            fill="none"
            stroke="rgba(46,29,10,0.3)"
            strokeWidth="0.8"
          />
          {/* monogram — embossed: dark relief below, gold catch above */}
          <text
            x="350"
            y="313"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-serif), Georgia, serif"
            fontSize="44"
            fontStyle="italic"
            fontWeight="600"
            letterSpacing="2"
            fill="rgba(40,23,6,0.9)"
            dy="2"
          >
            {site.initials[0]}{site.initials[1]}
          </text>
          <text
            x="350"
            y="313"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-serif), Georgia, serif"
            fontSize="44"
            fontStyle="italic"
            fontWeight="600"
            letterSpacing="2"
            fill="url(#goldBright)"
          >
            {site.initials[0]}{site.initials[1]}
          </text>
          {/* specular catch, top-left */}
          <ellipse
            cx="322"
            cy="276"
            rx="28"
            ry="12"
            fill="#fff6dd"
            opacity="0.3"
            filter="url(#softBlur)"
            transform="rotate(-24 322 276)"
          />
        </g>
      </motion.g>
    </svg>
  );
}
