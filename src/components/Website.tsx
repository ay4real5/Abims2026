"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";
import Photo from "./Photo";
import RsvpModal, { type RsvpChoice } from "./RsvpModal";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };
const scriptFont = { fontFamily: "var(--font-script), cursive" };
const EASE = [0.22, 1, 0.36, 1] as const;

/* transform-only reveal → content is never hidden if animation is skipped */
const reveal = {
  initial: { y: 28 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.8, ease: EASE },
};

function waShare(message: string) {
  const text = encodeURIComponent(message);
  return site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}

/* ── ambient sparkles (subtle, for the countdown band) ───────── */
const SPARKS = [
  { x: 12, y: 30, d: 5, delay: 0 },
  { x: 84, y: 22, d: 6, delay: 1.2 },
  { x: 68, y: 62, d: 5.5, delay: 0.6 },
  { x: 26, y: 70, d: 6.5, delay: 1.8 },
  { x: 92, y: 48, d: 5, delay: 0.9 },
  { x: 46, y: 18, d: 7, delay: 2.2 },
  { x: 8, y: 55, d: 6, delay: 1.5 },
];
function Sparkles() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: 4, height: 4, background: "#c8a25c", boxShadow: "0 0 8px 2px rgba(200,162,92,0.55)" }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.1, 0.5], y: [0, -12, 0] }}
          transition={{ duration: s.d, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ── section heading ─────────────────────────────────────────── */
function Title({ kicker, title, light }: { kicker: string; title: string; light?: boolean }) {
  return (
    <motion.div {...reveal} className="mb-14 text-center">
      <p className="text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.42em", color: light ? "#e7d4a6" : "#a98a52" }}>
        {kicker}
      </p>
      <h2 className="mt-3 text-4xl italic sm:text-5xl" style={{ ...serif, color: light ? "#fbf4e6" : "#463726" }}>
        {title}
      </h2>
      <div className="mx-auto mt-5 flex w-28 items-center gap-2">
        <div className="h-px flex-1" style={{ background: light ? "rgba(231,212,166,0.6)" : "rgba(169,138,82,0.5)" }} />
        <span style={{ color: light ? "#e7d4a6" : "#a98a52" }}>&#10022;</span>
        <div className="h-px flex-1" style={{ background: light ? "rgba(231,212,166,0.6)" : "rgba(169,138,82,0.5)" }} />
      </div>
    </motion.div>
  );
}

/* ── nav ─────────────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ...(site.story.length ? [["story", "Story"]] : []),
    ["details", "Details"],
    ...(site.timeline.length ? [["schedule", "Schedule"]] : []),
    ...(site.photos.gallery.length ? [["gallery", "Gallery"]] : []),
    ...(site.faq.length ? [["faq", "FAQ"]] : []),
    ["blessings", "Wishes"],
    ["rsvp", "RSVP"],
  ] as [string, string][];

  const ink = solid ? "#6b5d4f" : "#fbf4e6";

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-all duration-500"
      style={{
        background: solid ? "rgba(250,245,234,0.92)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: solid ? "1px solid rgba(169,138,82,0.25)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="text-xl italic transition-colors" style={{ ...scriptFont, color: solid ? "#8f7340" : "#fbf4e6", textShadow: solid ? "none" : "0 1px 6px rgba(0,0,0,0.35)" }}>
          {site.initials[0]}&amp;{site.initials[1]}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="text-[11px] font-light uppercase transition-opacity hover:opacity-70" style={{ ...sans, letterSpacing: "0.22em", color: ink, textShadow: solid ? "none" : "0 1px 6px rgba(0,0,0,0.4)" }}>
              {label}
            </a>
          ))}
        </nav>

        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)} style={{ color: ink }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 px-5 py-3 md:hidden" style={{ background: "rgba(250,245,234,0.97)", borderTop: "1px solid rgba(169,138,82,0.2)" }}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="py-2 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.22em", color: "#6b5d4f" }}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ── countdown ───────────────────────────────────────────────── */
function Countdown({ light }: { light?: boolean }) {
  const [left, setLeft] = useState<null | { d: number; h: number; m: number; s: number }>(null);
  useEffect(() => {
    const target = new Date(site.weddingDateISO).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({ d: Math.floor(diff / 86_400_000), h: Math.floor(diff / 3_600_000) % 24, m: Math.floor(diff / 60_000) % 60, s: Math.floor(diff / 1_000) % 60 });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const cells = [
    { n: left?.d ?? 0, label: "Days" },
    { n: left?.h ?? 0, label: "Hours" },
    { n: left?.m ?? 0, label: "Minutes" },
    { n: left?.s ?? 0, label: "Seconds" },
  ];
  const num = light ? "#fbf4e6" : "#463726";
  const lab = light ? "rgba(251,244,230,0.75)" : "#8a7a63";
  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-5">
      {cells.map((c) => (
        <div key={c.label} className="min-w-[62px] rounded-lg px-3 py-3 text-center" style={{ background: light ? "rgba(255,250,238,0.12)" : "rgba(255,250,238,0.7)", border: `1px solid ${light ? "rgba(231,212,166,0.4)" : "rgba(169,138,82,0.3)"}`, backdropFilter: light ? "blur(4px)" : "none" }}>
          <p className="text-3xl tabular-nums leading-none" style={{ ...serif, color: num }}>{String(c.n).padStart(2, "0")}</p>
          <p className="mt-1 text-[8px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: lab }}>{c.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── lightbox ────────────────────────────────────────────────── */
function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ background: "rgba(30,22,10,0.9)", backdropFilter: "blur(6px)" }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="relative h-[80vh] w-full max-w-3xl" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} transition={{ duration: 0.35, ease: EASE }}>
            <Photo src={src} alt="" className="h-full w-full rounded-lg" sizes="90vw" monogram={false} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── gallery carousel (coverflow, swipeable) ─────────────────── */
function GalleryCarousel({ photos, captions, onOpen }: { photos: string[]; captions: string[]; onOpen: (s: string) => void }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [touched, setTouched] = useState(false);
  const n = photos.length;
  const go = (d: number) => { setTouched(true); setI((v) => (v + d + n) % n); };
  const jump = (idx: number) => { setTouched(true); setI(idx); };
  const prev = (i - 1 + n) % n;
  const next = (i + 1) % n;

  // gentle auto-advance until the guest takes over — signals it's interactive
  useEffect(() => {
    if (touched || reduced || n < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 4500);
    return () => clearInterval(t);
  }, [touched, reduced, n]);

  const Arrow = ({ dir }: { dir: "l" | "r" }) => (
    <button
      onClick={() => go(dir === "l" ? -1 : 1)}
      aria-label={dir === "l" ? "Previous photo" : "Next photo"}
      className="absolute top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full text-2xl transition-all hover:scale-105 active:scale-90"
      style={{ [dir === "l" ? "left" : "right"]: -6, background: "linear-gradient(180deg,#f4e6c4,#d9b975)", color: "#5b4326", boxShadow: "0 8px 22px rgba(120,90,40,0.35)" }}
    >
      {dir === "l" ? "‹" : "›"}
    </button>
  );

  return (
    <div className="mx-auto max-w-lg">
      <div className="relative flex h-[62vh] max-h-[560px] items-center justify-center">
        {/* side peeks (tap to move) */}
        <button onClick={() => go(-1)} aria-hidden tabIndex={-1} className="absolute left-0 h-[72%] w-[30%] overflow-hidden rounded-xl opacity-40" style={{ transform: "scale(0.9)" }}>
          <Photo src={photos[prev]} alt="" className="h-full w-full" monogram={false} sizes="30vw" />
        </button>
        <button onClick={() => go(1)} aria-hidden tabIndex={-1} className="absolute right-0 h-[72%] w-[30%] overflow-hidden rounded-xl opacity-40" style={{ transform: "scale(0.9)" }}>
          <Photo src={photos[next]} alt="" className="h-full w-full" monogram={false} sizes="30vw" />
        </button>

        {/* active card — swipeable, tap to enlarge */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={i}
            className="relative z-20 h-full w-[70%] cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
            style={{ boxShadow: "0 22px 54px rgba(120,90,40,0.3)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.45, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            onClick={() => onOpen(photos[i])}
          >
            <Photo src={photos[i]} alt="" quality={95} className="pointer-events-none h-full w-full" monogram={false} sizes="70vw" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5" style={{ background: "linear-gradient(180deg, transparent, rgba(24,16,6,0.8))" }} />
            {captions[i] && (
              <span className="pointer-events-none absolute bottom-5 left-6 text-2xl italic" style={{ ...serif, color: "#fdf3de", textShadow: "0 1px 10px rgba(0,0,0,0.7)" }}>
                {captions[i]}
              </span>
            )}
            {/* tap-to-view badge */}
            <span className="pointer-events-none absolute right-4 top-4 rounded-full px-3 py-1 text-[9px] uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#3a2c14", background: "rgba(244,230,196,0.9)" }}>
              Tap to view
            </span>
          </motion.div>
        </AnimatePresence>

        <Arrow dir="l" />
        <Arrow dir="r" />
      </div>

      {/* counter + dots + hint */}
      <div className="mt-7 flex flex-col items-center gap-3">
        <p className="text-[12px]" style={{ ...serif, color: "#8f7340" }}>
          <span style={{ fontSize: "1.2em", color: "#463726" }}>{i + 1}</span> / {n}
        </p>
        <div className="flex gap-2">
          {photos.map((_, d) => (
            <button key={d} onClick={() => jump(d)} aria-label={`Go to photo ${d + 1}`} className="h-2 rounded-full transition-all" style={{ width: d === i ? 20 : 8, background: d === i ? "#a98a52" : "rgba(169,138,82,0.35)" }} />
          ))}
        </div>
        <motion.p
          className="text-[10px] font-light uppercase"
          style={{ ...sans, letterSpacing: "0.35em", color: "#a98a52" }}
          animate={touched ? { opacity: 0.55 } : reduced ? { opacity: 0.8 } : { opacity: [0.4, 1, 0.4] }}
          transition={touched ? { duration: 0.4 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          ‹ swipe to explore ›
        </motion.p>
      </div>
    </div>
  );
}

/* ── gift details modal ──────────────────────────────────────── */
const hasGiftDetails = Boolean(
  site.gift.accountName || site.gift.accountNumber || site.gift.sortCode || site.gift.bank,
);

function GiftRow({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — value is still visible to read */
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3.5 last:border-b-0" style={{ borderColor: "rgba(169,138,82,0.2)" }}>
      <div className="text-left">
        <p className="text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#a98a52" }}>{label}</p>
        <p className="mt-1 text-[17px]" style={{ ...serif, color: "#463726" }}>{value}</p>
      </div>
      {copyable && (
        <button onClick={copy} className="shrink-0 rounded-full px-4 py-1.5 text-[10px] uppercase transition-colors" style={{ ...sans, letterSpacing: "0.15em", color: copied ? "#3f8c46" : "#8f7340", border: `1px solid ${copied ? "rgba(63,140,70,0.5)" : "rgba(169,138,82,0.45)"}` }}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      )}
    </div>
  );
}

function GiftModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[85] flex items-center justify-center px-6 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button aria-label="Close" className="absolute inset-0" style={{ background: "rgba(30,22,10,0.55)", backdropFilter: "blur(6px)" }} onClick={onClose} />
          <motion.div className="relative max-h-[86vh] w-full max-w-sm overflow-y-auto rounded-2xl px-7 py-9" style={{ background: "linear-gradient(178deg,#faf5ea,#f1e7d0)" }} initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} transition={{ duration: 0.4, ease: EASE }}>
            <p className="text-center text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "#a98a52" }}>With gratitude</p>
            <h3 className="mt-3 text-center text-3xl italic" style={{ ...serif, color: "#463726" }}>Gift Details</h3>
            <p className="mx-auto mt-4 max-w-xs text-center text-sm font-light italic leading-relaxed" style={{ ...serif, color: "#6b5d4f" }}>
              If you would like to bless us with a gift, you can send it to the account below.
            </p>

            <div className="mt-6 rounded-xl px-5" style={{ background: "#fffdf7", border: "1px solid rgba(169,138,82,0.3)" }}>
              <GiftRow label="Account name" value={site.gift.accountName} />
              <GiftRow label="Bank" value={site.gift.bank} />
              <GiftRow label="Account number" value={site.gift.accountNumber} copyable />
              <GiftRow label="Sort code" value={site.gift.sortCode} copyable />
            </div>

            <p className="mt-5 text-center text-[11px] font-light italic" style={{ ...serif, color: "#8a7a63" }}>
              Thank you for your love and generosity.
            </p>
            <button onClick={onClose} className="mt-6 block w-full text-center text-[10px] font-light uppercase underline underline-offset-4" style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}>Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── blessings wall ──────────────────────────────────────────── */
function BlessingWall() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const post = () => {
    if (!msg.trim()) return;
    const text = `${site.hashtag} — A blessing for ${site.coupleNames} from ${name.trim() || "a well-wisher"}: ${msg.trim()}`;
    window.open(waShare(text), "_blank", "noopener,noreferrer");
    setMsg("");
    setName("");
  };
  const field = { ...sans, background: "#f6efe1", color: "#463726", border: "1px solid rgba(169,138,82,0.3)" } as const;
  return (
    <section id="blessings" className="px-6 py-24" style={{ background: "linear-gradient(180deg,#241a0e 0%,#191109 100%)" }}>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.45em", color: "#c8a25c" }}>Blessings Wall</p>
        <h2 className="mt-3 text-4xl italic sm:text-5xl" style={{ ...serif, color: "#f6ead0" }}>Leave a Wish</h2>
        <div className="mt-10 rounded-2xl p-5 text-left" style={{ background: "rgba(255,250,238,0.04)", border: "1px solid rgba(169,138,82,0.25)" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg px-4 py-3.5 text-[15px] outline-none"
            style={field}
          />
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={`Your blessing for ${site.coupleNames}`}
            rows={4}
            className="mt-3 w-full resize-none rounded-lg px-4 py-3.5 text-[15px] outline-none"
            style={field}
          />
          <button
            onClick={post}
            className="mt-3 w-full rounded-lg py-3.5 text-[12px] uppercase transition-transform active:scale-[0.98]"
            style={{ ...sans, letterSpacing: "0.3em", color: "#f6ead0", background: "transparent", border: "1px solid rgba(200,162,92,0.7)" }}
          >
            Post blessing
          </button>
        </div>
        <p className="mt-4 text-[11px] font-light italic" style={{ ...serif, color: "rgba(246,234,208,0.6)" }}>
          Your wish opens WhatsApp to send straight to the couple.
        </p>
      </div>
    </section>
  );
}

/* ── the website ─────────────────────────────────────────────── */
export default function Website() {
  const reduced = useReducedMotion();
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [replied, setReplied] = useState<RsvpChoice | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [giftsOpen, setGiftsOpen] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("abims-rsvp");
    if (s === "yes" || s === "no") setReplied(s);
  }, []);

  return (
    <div id="top" style={{ background: "#faf5ea", color: "#4a3d2c", ...serif }}>
      <Header />

      {/* ═ HERO ═ */}
      <section className="relative flex h-[100dvh] items-end justify-center overflow-hidden pb-[13dvh] text-center">
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.07] }}
          transition={{ duration: 24, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <Photo src={site.photos.hero} alt={site.coupleNames} priority quality={95} sizes="100vw" className="h-full w-full" monogram={!site.photos.hero} position="center 38%" />
        </motion.div>
        {/* cinematic scrim — light at top so faces read, deep at the base for the type */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(24,16,6,0.32) 0%, rgba(24,16,6,0.04) 26%, rgba(24,16,6,0.16) 52%, rgba(24,16,6,0.7) 82%, rgba(24,16,6,0.9) 100%)" }} />

        <motion.div className="relative px-6" initial={{ y: 20, opacity: 0.001 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}>
          <p className="text-[10px] font-light uppercase sm:text-[11px]" style={{ ...sans, letterSpacing: "0.55em", color: "#eecf8f", textShadow: "0 1px 12px rgba(0,0,0,0.7)" }}>
            We&apos;re getting married
          </p>
          <h1 className="mx-auto mt-5 max-w-[94vw] break-words leading-[1.06]" style={{ ...scriptFont, fontSize: "clamp(44px, 10vw, 112px)", color: "#fefaf0", textShadow: "0 3px 28px rgba(0,0,0,0.7), 0 0 70px rgba(0,0,0,0.4)" }}>
            {site.coupleNames}
          </h1>
          <div className="mx-auto mt-5 flex w-44 items-center gap-3">
            <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,transparent,rgba(238,207,143,0.85))" }} />
            <span style={{ color: "#eecf8f" }}>&#10022;</span>
            <div className="h-px flex-1" style={{ background: "linear-gradient(270deg,transparent,rgba(238,207,143,0.85))" }} />
          </div>
          <p className="mt-5 text-lg italic sm:text-xl" style={{ color: "#fdf3de", textShadow: "0 1px 14px rgba(0,0,0,0.7)" }}>
            {site.dateWords}
          </p>
        </motion.div>

        {/* scroll cue */}
        <motion.a href="#invite" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}>
          <motion.span className="block text-lg" style={{ color: "#eecf8f" }} animate={reduced ? undefined : { y: [0, 7, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>⌄</motion.span>
        </motion.a>
      </section>

      {/* ═ INVITATION + COUNTDOWN ═ */}
      <section id="invite" className="relative overflow-hidden px-6 py-24 text-center" style={{ background: "radial-gradient(120% 80% at 50% 0%, #fdf9ef 0%, #f4ead4 100%)" }}>
        <Sparkles />
        <motion.div {...reveal} className="relative mx-auto max-w-xl">
          <p className="mx-auto text-3xl italic" style={{ ...scriptFont, color: "#8f7340" }}>{site.initials[0]} &amp; {site.initials[1]}</p>
          <p className="mt-8 text-xl font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>
            Together with their families, they joyfully invite you to celebrate their marriage.
          </p>

          <p className="mt-10 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "#a98a52" }}>Saturday</p>
          <p className="mt-2 text-4xl italic" style={{ ...serif, color: "#463726" }}>15 August 2026</p>
          <p className="mt-3 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.18em", color: "#6b5d4f" }}>
            {site.ceremony.time} · Church &nbsp;|&nbsp; {site.reception.time} · Reception
          </p>

          <div className="mt-10">
            <Countdown />
          </div>

          <div id="rsvp" className="mt-12 flex scroll-mt-24 flex-col items-center gap-4">
            <button onClick={() => setRsvpOpen(true)} className="inline-block rounded-full px-14 py-4 text-[12px] uppercase transition-transform active:scale-95" style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", boxShadow: "0 8px 24px rgba(120,90,40,0.25)" }}>
              RSVP now
            </button>
            {replied && (
              <p className="text-sm italic" style={{ ...serif, color: "#8a7a63" }}>
                You replied: {replied === "yes" ? "joyfully accepting" : "regretfully declining"}
              </p>
            )}
            <a href="#details" className="text-[11px] font-light uppercase underline underline-offset-4" style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}>
              View venues
            </a>
          </div>
        </motion.div>
      </section>

      {/* ═ OUR STORY (alternating photo / text) ═ */}
      {site.story.length > 0 && (
        <section id="story" className="px-6 py-24" style={{ background: "#f3ead6" }}>
          <div className="mx-auto max-w-5xl">
            <Title kicker="How it began" title="Our Story" />
            <div className="space-y-16">
              {site.story.map((para, i) => (
                <div key={i} className={`flex flex-col items-center gap-8 md:flex-row ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                  <motion.div {...reveal} className="w-full md:w-1/2">
                    <div className="relative">
                      <Photo src={site.photos.story[i]} alt="" quality={95} sizes="(min-width:768px) 45vw, 90vw" className="aspect-[4/5] w-full rounded-2xl shadow-[0_18px_44px_rgba(120,90,40,0.16)]" />
                      <span className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(143,115,64,0.18)" }} />
                    </div>
                  </motion.div>
                  <motion.div {...reveal} className="w-full md:w-1/2 text-center md:text-left">
                    <p className="text-lg font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>{para}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ DETAILS ═ */}
      <section id="details" className="px-6 py-24" style={{ background: "#faf5ea" }}>
        <div className="mx-auto max-w-4xl">
          <Title kicker="When &amp; where" title="The Details" />
          <div className="grid gap-6 md:grid-cols-2">
            {[site.ceremony, site.reception].map((b) => (
              <motion.div key={b.title} {...reveal} className="rounded-2xl px-8 py-10 text-center" style={{ background: "#fdfaf2", border: "1px solid rgba(169,138,82,0.25)", boxShadow: "0 12px 34px rgba(120,90,40,0.07)" }}>
                {b.icon && <p className="text-3xl" aria-hidden>{b.icon}</p>}
                <p className="mt-3 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "#a98a52" }}>{b.title}</p>
                <p className="mt-4 text-[13px] font-light uppercase" style={{ ...sans, letterSpacing: "0.28em", color: "#8f7340" }}>{b.time}</p>
                <h3 className="mt-4 text-2xl italic" style={{ color: "#463726" }}>{b.venue}</h3>
                {b.address.map((l) => <p key={l} className="mt-1 text-sm font-light italic" style={{ color: "#6b5d4f" }}>{l}</p>)}
                {b.mapsUrl && (
                  <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-full px-6 py-2.5 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.22em", color: "#8f7340", border: "1px solid rgba(169,138,82,0.45)" }}>Open directions</a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═ SCHEDULE ═ */}
      {site.timeline.length > 0 && (
        <section id="schedule" className="px-6 py-24" style={{ background: "#f3ead6" }}>
          <div className="mx-auto max-w-xl">
            <Title kicker="The order of the day" title="Schedule" />
            <div className="relative mx-auto max-w-sm">
              <div className="absolute bottom-2 left-[7px] top-2 w-px" style={{ background: "rgba(169,138,82,0.35)" }} aria-hidden />
              {site.timeline.map((s) => (
                <motion.div key={s.what} {...reveal} className="relative mb-8 pl-10 text-left last:mb-0">
                  <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full" style={{ background: "#f3ead6", border: "2px solid #a98a52" }} aria-hidden />
                  <p className="text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}>{s.time}</p>
                  <p className="mt-1 text-xl italic" style={{ color: "#463726" }}>{s.what}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ GALLERY ═ */}
      {site.photos.gallery.length > 0 && (
        <section id="gallery" className="px-6 py-24" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-5xl">
            <Title kicker="Memories" title="A Living Gallery" />
            <GalleryCarousel photos={site.photos.gallery} captions={site.photos.galleryCaptions} onOpen={setLightbox} />
          </div>
        </section>
      )}

      {/* ═ DRESS CODE ═ */}
      <section className="px-6 py-24 text-center" style={{ background: "#f3ead6" }}>
        <div className="mx-auto max-w-2xl">
          <Title kicker="What to wear" title="Dress Code" />
          <motion.p {...reveal} className="text-2xl italic" style={{ color: "#463726" }}>{site.dressCode}</motion.p>
          <motion.div {...reveal} className="mt-8 flex items-center justify-center gap-8">
            {[{ c: "#e8dcc0", label: "Ivory" }, { c: "#cdb06a", label: "Champagne Gold" }].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-full" style={{ background: s.c, boxShadow: "inset 0 2px 6px rgba(255,255,255,0.5), 0 2px 8px rgba(120,90,40,0.15)" }} />
                <span className="text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8a7a63" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
          {site.dressNote && <motion.p {...reveal} className="mx-auto mt-8 max-w-md text-sm font-light italic leading-relaxed" style={{ color: "#6b5d4f" }}>{site.dressNote}</motion.p>}
        </div>
      </section>

      {/* ═ GIFTS ═ */}
      {site.giftNote && (
        <section className="px-6 py-24 text-center" style={{ background: "linear-gradient(180deg,#f4ead4,#efe3c9)" }}>
          <div className="mx-auto max-w-xl">
            <p className="text-2xl" style={{ ...scriptFont, color: "#a98a52" }}>&amp; &#10047;</p>
            <h2 className="mt-4 text-4xl italic" style={{ ...serif, color: "#463726" }}>Gifts</h2>
            <motion.p {...reveal} className="mt-8 text-lg font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>{site.giftNote}</motion.p>
            {hasGiftDetails && (
              <motion.button {...reveal} onClick={() => setGiftsOpen(true)} className="mt-10 inline-block rounded-full px-14 py-4 text-[12px] uppercase transition-transform active:scale-95" style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", boxShadow: "0 8px 24px rgba(120,90,40,0.22)" }}>
                View gift details
              </motion.button>
            )}
          </div>
        </section>
      )}

      {/* Gifts modal */}
      <GiftModal open={giftsOpen} onClose={() => setGiftsOpen(false)} />

      {/* ═ A QUIET PHOTO MOMENT (the RSVP now lives in the countdown block) ═ */}
      <section className="relative h-[52vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.06] }}
          transition={{ duration: 22, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <Photo src={site.photos.rsvp} alt="" quality={95} sizes="100vw" className="h-full w-full" monogram={!site.photos.rsvp} position="center 35%" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(24,16,6,0.4), rgba(24,16,6,0.55))" }} />
        <div className="relative flex h-full items-center justify-center px-6 text-center">
          <p className="text-3xl italic sm:text-4xl" style={{ ...scriptFont, color: "#fdf3de", textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
            We can&apos;t wait to celebrate with you
          </p>
        </div>
      </section>

      {/* ═ FAQ ═ */}
      {site.faq.length > 0 && (
        <section id="faq" className="px-6 py-24" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-2xl">
            <Title kicker="Good to know" title="Questions" />
            <div className="space-y-4">
              {site.faq.map((f) => (
                <motion.details key={f.q} {...reveal} className="rounded-xl px-6 py-4" style={{ background: "#fdfaf2", border: "1px solid rgba(169,138,82,0.22)" }}>
                  <summary className="cursor-pointer list-none text-[15px] italic" style={{ color: "#463726" }}>{f.q}</summary>
                  <p className="mt-3 text-sm font-light leading-relaxed" style={{ color: "#6b5d4f" }}>{f.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ BLESSINGS WALL ═ */}
      <BlessingWall />

      {/* ═ FOOTER ═ */}
      <footer className="px-6 py-20 text-center" style={{ background: "linear-gradient(180deg,#efe3c9,#e6d5b0)" }}>
        <p style={{ ...scriptFont, fontSize: 44, color: "#8f7340" }}>{site.coupleNames}</p>
        <p className="mt-3 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "#6b5d4f" }}>{site.dateLine}</p>
        <p className="mt-6 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "rgba(107,93,79,0.7)" }}>{site.hashtag}</p>
        {site.photographyCredit && (
          <p className="mt-4 text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "rgba(107,93,79,0.55)" }}>Photography · {site.photographyCredit}</p>
        )}
      </footer>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} onChoose={(c) => { setReplied(c); localStorage.setItem("abims-rsvp", c); }} />
      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
