"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import { site } from "@/config/site";
import { useParallax } from "@/lib/useParallax";
import ParticleField from "./ParticleField";
import RsvpModal, { type RsvpChoice } from "../RsvpModal";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };
const scriptFont = { fontFamily: "var(--font-script), cursive" };
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── shared bits ─────────────────────────────────────────────── */

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    className="text-[10px] font-light uppercase"
    style={{ ...sans, letterSpacing: "0.5em", color: "#a98a52" }}
    initial={{ opacity: 0, letterSpacing: "0.2em" }}
    whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
    viewport={{ once: true }}
    transition={{ duration: 1.4, ease: EASE }}
  >
    {children}
  </motion.p>
);

const GoldRule = () => (
  <div aria-hidden className="mx-auto flex w-full max-w-[240px] items-center gap-3">
    <motion.div
      className="h-px flex-1 origin-right"
      style={{ background: "linear-gradient(90deg, transparent, rgba(169,138,82,0.8))" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE }}
    />
    <motion.span
      className="text-base"
      style={{ color: "#a98a52" }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      ✦
    </motion.span>
    <motion.div
      className="h-px flex-1 origin-left"
      style={{ background: "linear-gradient(270deg, transparent, rgba(169,138,82,0.8))" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE }}
    />
  </div>
);

/** A full-viewport scene with a soft champagne glow behind it. */
function Scene({
  id,
  children,
  glow = "rgba(214,178,110,0.16)",
  min = true,
}: {
  id?: string;
  children: React.ReactNode;
  glow?: string;
  min?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative flex ${min ? "min-h-[100dvh]" : "min-h-[70dvh]"} scroll-mt-4 flex-col items-center justify-center px-8 py-24 text-center`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(closest-side, ${glow}, transparent 70%)` }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: EASE }}
      />
      <div className="relative w-full max-w-md">{children}</div>
    </section>
  );
}

/* ── living countdown ────────────────────────────────────────── */

function Countdown() {
  const [left, setLeft] = useState<null | { d: number; h: number; m: number; s: number }>(null);
  useEffect(() => {
    const target = new Date(site.weddingDateISO).getTime();
    const tick = () =>
      setLeft(() => {
        const diff = Math.max(0, target - Date.now());
        return {
          d: Math.floor(diff / 86_400_000),
          h: Math.floor(diff / 3_600_000) % 24,
          m: Math.floor(diff / 60_000) % 60,
          s: Math.floor(diff / 1_000) % 60,
        };
      });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (!left) return <div className="h-28" aria-hidden />;
  const cells = [
    { n: left.d, label: "days" },
    { n: left.h, label: "hours" },
    { n: left.m, label: "minutes" },
    { n: left.s, label: "seconds" },
  ];
  return (
    <div className="flex items-stretch justify-center gap-3">
      {cells.map((c) => (
        <div
          key={c.label}
          className="flex min-w-[64px] flex-col items-center rounded-xl px-2 py-4"
          style={{
            background: "linear-gradient(180deg, rgba(255,250,238,0.6), rgba(240,228,203,0.3))",
            border: "1px solid rgba(169,138,82,0.3)",
            boxShadow: "inset 0 1px 0 rgba(255,250,238,0.7), 0 6px 20px rgba(120,90,40,0.08)",
          }}
        >
          <div className="relative h-11 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={c.n}
                className="text-4xl tabular-nums leading-none"
                style={{ ...serif, color: "#4a3d2c" }}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {String(c.n).padStart(2, "0")}
              </motion.p>
            </AnimatePresence>
          </div>
          <p
            className="mt-2 text-[8px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.25em", color: "#8a7a63" }}
          >
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── nav & music ─────────────────────────────────────────────── */

function Nav() {
  const items = [
    { id: "hero", label: "Home" },
    ...(site.story.length ? [{ id: "story", label: "Story" }] : []),
    { id: "details", label: "Details" },
    ...(site.timeline.length ? [{ id: "day", label: "The Day" }] : []),
    ...(site.gallery.length ? [{ id: "gallery", label: "Gallery" }] : []),
    { id: "rsvp", label: "RSVP" },
  ];
  return (
    <motion.nav
      className="fixed inset-x-0 top-0 z-30"
      style={{
        background: "linear-gradient(180deg, rgba(246,239,223,0.9), rgba(246,239,223,0))",
        backdropFilter: "blur(6px)",
      }}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.4 }}
    >
      <div className="mx-auto flex max-w-md items-center justify-center gap-5 overflow-x-auto px-6 py-3 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="text-[9px] font-light uppercase transition-opacity hover:opacity-60"
            style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340" }}
          >
            {it.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

/* ── the experience ──────────────────────────────────────────── */

function waShare(message: string) {
  const text = encodeURIComponent(message);
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export default function Experience() {
  const reduced = useReducedMotion();
  const { x: px, y: py } = useParallax();
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [replied, setReplied] = useState<RsvpChoice | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = localStorage.getItem("abims-rsvp");
    if (s === "yes" || s === "no") setReplied(s);
  }, []);

  // background monogram + spotlight drift with the pointer
  const monoX = useTransform(px, (v) => v * -24);
  const monoY = useTransform(py, (v) => v * -24);
  const spotX = useTransform(px, (v) => `${50 + v * 10}%`);
  const spotY = useTransform(py, (v) => `${38 + v * 8}%`);

  return (
    <div
      ref={scroller}
      className="absolute inset-0 overflow-y-auto scroll-smooth"
      style={{ background: "linear-gradient(178deg, #f6efdf 0%, #efe4cb 55%, #e7d9b8 100%)" }}
    >
      {/* ─ fixed atmospheric background ─ */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: useTransformSpotlight(spotX, spotY) }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 flex items-center justify-center"
        style={{ x: monoX, y: monoY }}
      >
        <span
          style={{
            ...scriptFont,
            fontSize: "78vmin",
            lineHeight: 1,
            color: "rgba(169,138,82,0.05)",
          }}
        >
          {site.initials[0]}
        </span>
      </motion.div>

      {/* ─ moving gold-dust depth field ─ */}
      {!reduced && <ParticleField px={px} py={py} />}

      <Nav />

      {/* ═ HERO ═ */}
      <Scene id="hero" glow="rgba(214,178,110,0.22)">
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-8 w-fit"
        >
          <svg viewBox="0 0 120 70" className="h-16 w-auto" aria-hidden>
            <circle cx="48" cy="38" r="24" fill="none" stroke="#a98a52" strokeWidth="1.4" />
            <circle cx="72" cy="38" r="24" fill="none" stroke="#8f7340" strokeWidth="1.1" opacity="0.8" />
            <path d="M48 10 l4 5 -4 5 -4 -5 Z" fill="#a98a52" opacity="0.7" />
          </svg>
        </motion.div>

        <Kicker>Are getting married</Kicker>

        <motion.div className="relative mt-6 overflow-hidden px-2">
          <motion.h1
            className="leading-[1.05]"
            style={{ ...scriptFont, fontSize: "clamp(46px, 15vw, 76px)", color: "#463726" }}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
          >
            {site.coupleNames}
          </motion.h1>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,238,190,0) 0%, rgba(255,238,190,0.9) 50%, rgba(255,238,190,0) 100%)",
              mixBlendMode: "overlay",
            }}
            animate={{ left: ["-60%", "120%"] }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 1, repeat: Infinity, repeatDelay: 4 }}
          />
        </motion.div>

        <motion.p
          className="mt-8 text-lg italic"
          style={{ ...serif, color: "#6b5d4f" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.9 }}
        >
          {site.dateWords}
          <br />
          <span className="text-[13px] not-italic" style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340" }}>
            {site.year}
          </span>
        </motion.p>

        {/* live scroll cue */}
        <motion.div
          className="absolute inset-x-0 -bottom-16 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1.4 }}
        >
          <p className="text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "#a98a52" }}>
            begin
          </p>
          <motion.span
            className="mt-2 text-lg"
            style={{ color: "#a98a52" }}
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            ⌄
          </motion.span>
        </motion.div>
      </Scene>

      {/* ═ INVITATION ═ */}
      <Scene glow="rgba(200,162,92,0.14)" min={false}>
        <GoldRule />
        <p className="mt-10 text-xl font-light italic leading-relaxed" style={{ ...serif, color: "#5b4a35" }}>
          Together with their families,
          <br />
          they request the honour of your
          <br />
          presence at the celebration
          <br />
          of their marriage.
        </p>
        <div className="mt-10">
          <GoldRule />
        </div>
      </Scene>

      {/* ═ COUNTDOWN ═ */}
      <Scene glow="rgba(214,178,110,0.2)" min={false}>
        <Kicker>Counting the moments</Kicker>
        <div className="mt-10">
          <Countdown />
        </div>
      </Scene>

      {/* ═ STORY ═ */}
      {site.story.length > 0 && (
        <Scene id="story" glow="rgba(200,162,92,0.13)" min={false}>
          <Kicker>Our story</Kicker>
          <div className="mt-8 space-y-6">
            {site.story.map((p, i) => (
              <motion.p
                key={i}
                className="text-lg font-light italic leading-relaxed"
                style={{ ...serif, color: "#5b4a35" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: EASE, delay: i * 0.2 }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </Scene>
      )}

      {/* ═ DETAILS ═ */}
      <Scene id="details" glow="rgba(214,178,110,0.18)">
        <Kicker>When &amp; where</Kicker>
        <div className="mt-10 space-y-12">
          {[site.ceremony, site.reception].map((b) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              <p className="text-[10px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "#a98a52" }}>
                {b.title}
              </p>
              <p className="mt-3 text-2xl italic" style={{ ...serif, color: "#463726" }}>
                {b.venue}
              </p>
              {b.address.map((l) => (
                <p key={l} className="mt-1 text-sm font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
                  {l}
                </p>
              ))}
              <p className="mt-3 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}>
                {b.time}
              </p>
            </motion.div>
          ))}
        </div>
        {site.mapsUrl && (
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block text-[11px] font-light uppercase underline underline-offset-4"
            style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
          >
            View the location
          </a>
        )}
      </Scene>

      {/* ═ THE DAY ═ */}
      {site.timeline.length > 0 && (
        <Scene id="day" glow="rgba(200,162,92,0.14)">
          <Kicker>The day</Kicker>
          <div className="mx-auto mt-10 max-w-[300px]">
            {site.timeline.map((s, i) => (
              <motion.div
                key={s.what}
                className="flex items-center gap-4 py-3"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE, delay: i * 0.08 }}
              >
                <span className="w-20 text-right text-sm italic" style={{ ...serif, color: "#463726" }}>
                  {s.time}
                </span>
                <span className="h-2 w-2 shrink-0 rotate-45" style={{ background: "#a98a52" }} />
                <span className="flex-1 text-left text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#6b5d4f" }}>
                  {s.what}
                </span>
              </motion.div>
            ))}
          </div>
        </Scene>
      )}

      {/* ═ DRESS CODE ═ */}
      <Scene glow="rgba(214,178,110,0.16)" min={false}>
        <Kicker>Dress code</Kicker>
        <p className="mt-8 text-2xl italic" style={{ ...serif, color: "#463726" }}>
          {site.dressCode}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          {[
            { c: "#e8dcc0", label: "Ivory" },
            { c: "#d9b975", label: "Champagne" },
            { c: "#a98a52", label: "Gold" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div
                className="h-10 w-10 rounded-full"
                style={{ background: s.c, boxShadow: "inset 0 2px 6px rgba(255,255,255,0.5), 0 2px 8px rgba(120,90,40,0.2)" }}
              />
              <span className="text-[8px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8a7a63" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
        {site.dressLadies && (
          <p className="mt-8 text-sm font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            Ladies — {site.dressLadies}
          </p>
        )}
        {site.dressGentlemen && (
          <p className="mt-2 text-sm font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            Gentlemen — {site.dressGentlemen}
          </p>
        )}
      </Scene>

      {/* ═ GALLERY ═ */}
      {site.gallery.length > 0 && (
        <Scene id="gallery" glow="rgba(200,162,92,0.13)">
          <Kicker>Moments</Kicker>
          <div className="mt-10 grid grid-cols-2 gap-3">
            {site.gallery.map((src) => (
              <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image src={src} alt="" fill className="object-cover" sizes="45vw" />
              </div>
            ))}
          </div>
        </Scene>
      )}

      {/* ═ GIFTS ═ */}
      {site.giftNote && (
        <Scene glow="rgba(214,178,110,0.14)" min={false}>
          <Kicker>Gifts</Kicker>
          <p className="mx-auto mt-8 max-w-[320px] text-lg font-light italic leading-relaxed" style={{ ...serif, color: "#5b4a35" }}>
            {site.giftNote}
          </p>
          {site.giftDetails && (
            <p className="mt-5 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8f7340" }}>
              {site.giftDetails}
            </p>
          )}
        </Scene>
      )}

      {/* ═ RSVP — the climax ═ */}
      <Scene id="rsvp" glow="rgba(214,178,110,0.28)">
        <Kicker>Will you join us</Kicker>
        <p className="mt-8 text-3xl italic" style={{ ...scriptFont, color: "#463726" }}>
          Kindly reply
        </p>
        <motion.button
          onClick={() => setRsvpOpen(true)}
          className="mt-10 inline-block rounded-full px-16 py-5 text-[12px] uppercase active:scale-95"
          style={{
            ...sans,
            letterSpacing: "0.35em",
            color: "#f6efe1",
            background: "linear-gradient(180deg, #b7995c 0%, #8f7340 100%)",
          }}
          animate={
            reduced
              ? undefined
              : {
                  boxShadow: [
                    "0 4px 16px rgba(120,90,40,0.3), 0 0 0 rgba(217,185,117,0)",
                    "0 4px 22px rgba(120,90,40,0.4), 0 0 34px rgba(217,185,117,0.6)",
                    "0 4px 16px rgba(120,90,40,0.3), 0 0 0 rgba(217,185,117,0)",
                  ],
                  scale: [1, 1.035, 1],
                }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          RSVP
        </motion.button>
        {replied && (
          <p className="mt-6 text-sm italic" style={{ ...serif, color: "#8a7a63" }}>
            You replied: {replied === "yes" ? "joyfully accepting" : "regretfully declining"}
          </p>
        )}
        <a
          href={waShare(site.blessingMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block text-[11px] font-light uppercase underline underline-offset-4"
          style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
        >
          Leave a blessing
        </a>
      </Scene>

      {/* ═ FAQ ═ */}
      {site.faq.length > 0 && (
        <Scene glow="rgba(200,162,92,0.12)" min={false}>
          <Kicker>Good to know</Kicker>
          <div className="mt-10 space-y-7 text-left">
            {site.faq.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
              >
                <p className="text-[15px] italic" style={{ ...serif, color: "#463726" }}>
                  {f.q}
                </p>
                <p className="mt-1 text-sm font-light leading-relaxed" style={{ ...serif, color: "#6b5d4f" }}>
                  {f.a}
                </p>
              </motion.div>
            ))}
          </div>
        </Scene>
      )}

      {/* ═ FOOTER ═ */}
      <Scene glow="rgba(214,178,110,0.16)" min={false}>
        <p style={{ ...scriptFont, fontSize: 44, color: "#8f7340" }}>with love</p>
        <p className="mt-4 text-3xl italic" style={{ ...scriptFont, color: "#463726" }}>
          {site.coupleNames}
        </p>
        <p className="mt-8 text-[10px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "rgba(107,93,79,0.7)" }}>
          {site.hashtag}
        </p>
      </Scene>

      <RsvpModal
        open={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        onChoose={(c) => {
          setReplied(c);
          localStorage.setItem("abims-rsvp", c);
        }}
      />
    </div>
  );
}

/* spotlight gradient that tracks live pointer motion values */
function useTransformSpotlight(x: MotionValue<string>, y: MotionValue<string>) {
  return useMotionTemplate`radial-gradient(60% 50% at ${x} ${y}, rgba(255,248,228,0.65) 0%, rgba(255,248,228,0) 60%)`;
}
