"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { site } from "@/config/site";
import RsvpModal, { type RsvpChoice } from "./RsvpModal";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };
const scriptFont = { fontFamily: "var(--font-script), cursive" };

/* subtle, standard scroll-in — transform only, so content is never hidden
   if animation is disabled or JS is slow */
const inView = {
  initial: { y: 26 },
  whileInView: { y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function waShare(message: string) {
  const text = encodeURIComponent(message);
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

/* ── reusable section heading ────────────────────────────────── */
function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div {...inView} className="mb-12 text-center">
      <p className="text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "#a98a52" }}>
        {kicker}
      </p>
      <h2 className="mt-3 text-4xl italic" style={{ ...serif, color: "#463726" }}>
        {title}
      </h2>
      <div className="mx-auto mt-5 flex w-32 items-center gap-2">
        <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.5)" }} />
        <span style={{ color: "#a98a52" }}>&#10022;</span>
        <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.5)" }} />
      </div>
    </motion.div>
  );
}

/* ── header / nav ────────────────────────────────────────────── */
function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ...(site.story.length ? [["story", "Story"]] : []),
    ["details", "Details"],
    ...(site.timeline.length ? [["schedule", "Schedule"]] : []),
    ...(site.gallery.length ? [["gallery", "Gallery"]] : []),
    ...(site.faq.length ? [["faq", "FAQ"]] : []),
    ["rsvp", "RSVP"],
  ] as [string, string][];

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        background: "rgba(250,245,234,0.9)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(169,138,82,0.25)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <a href="#top" className="text-xl italic" style={{ ...scriptFont, color: "#8f7340" }}>
          {site.initials[0]}&amp;{site.initials[1]}
        </a>

        {/* desktop links */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-[11px] font-light uppercase transition-opacity hover:opacity-60"
              style={{ ...sans, letterSpacing: "0.22em", color: "#6b5d4f" }}
            >
              {label}
            </a>
          ))}
          <a
            href="#rsvp"
            className="rounded-full px-5 py-2 text-[11px] uppercase"
            style={{ ...sans, letterSpacing: "0.22em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)" }}
          >
            RSVP
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          className="md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          style={{ color: "#8f7340" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <><path d="M4 8h16M4 16h16" strokeLinecap="round" /></>}
          </svg>
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t px-5 py-3 md:hidden" style={{ borderColor: "rgba(169,138,82,0.2)" }}>
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="py-2 text-[12px] font-light uppercase"
              style={{ ...sans, letterSpacing: "0.22em", color: "#6b5d4f" }}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ── countdown ───────────────────────────────────────────────── */
function Countdown() {
  const [left, setLeft] = useState<null | { d: number; h: number; m: number; s: number }>(null);
  useEffect(() => {
    const target = new Date(site.weddingDateISO).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor(diff / 3_600_000) % 24,
        m: Math.floor(diff / 60_000) % 60,
        s: Math.floor(diff / 1_000) % 60,
      });
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
  return (
    <div className="flex items-stretch justify-center gap-3 sm:gap-5">
      {cells.map((c) => (
        <div key={c.label} className="min-w-[62px] rounded-lg px-3 py-3 text-center" style={{ background: "rgba(255,250,238,0.7)", border: "1px solid rgba(169,138,82,0.3)" }}>
          <p className="text-3xl tabular-nums leading-none" style={{ ...serif, color: "#463726" }}>
            {String(c.n).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[8px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8a7a63" }}>
            {c.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── the website ─────────────────────────────────────────────── */
export default function Website() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [replied, setReplied] = useState<RsvpChoice | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("abims-rsvp");
    if (s === "yes" || s === "no") setReplied(s);
  }, []);

  return (
    <div
      id="top"
      className="min-h-[100dvh] w-full"
      style={{ background: "#faf5ea", color: "#4a3d2c", ...serif }}
    >
      <Header />

      {/* ═ HERO ═ */}
      <section
        className="relative flex min-h-[92dvh] flex-col items-center justify-center px-6 py-24 text-center"
        style={{ background: "radial-gradient(120% 90% at 50% 20%, #fdf9ef 0%, #f3e9d2 60%, #ecdfc2 100%)" }}
      >
        <motion.div
          className="w-full"
          initial={{ y: 18 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 120 70" className="mx-auto h-14 w-auto" aria-hidden>
            <circle cx="48" cy="38" r="24" fill="none" stroke="#a98a52" strokeWidth="1.4" />
            <circle cx="72" cy="38" r="24" fill="none" stroke="#8f7340" strokeWidth="1.1" opacity="0.8" />
            <path d="M48 10 l4 5 -4 5 -4 -5 Z" fill="#a98a52" opacity="0.7" />
          </svg>
          <p className="mt-8 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.4em", color: "#a98a52" }}>
            We&apos;re getting married
          </p>
          <h1 className="mx-auto mt-5 max-w-full break-words leading-[1.1]" style={{ ...scriptFont, fontSize: "clamp(34px, 9vw, 84px)", color: "#463726" }}>
            {site.coupleNames}
          </h1>
          <p className="mt-6 text-lg italic" style={{ color: "#6b5d4f" }}>
            {site.dateWords}
          </p>
          <p className="mt-1 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340" }}>
            {site.ceremony.address.at(-1)}
          </p>

          <div className="mt-12">
            <Countdown />
          </div>

          <a
            href="#rsvp"
            className="mt-12 inline-block rounded-full px-12 py-4 text-[12px] uppercase transition-transform active:scale-95"
            style={{ ...sans, letterSpacing: "0.3em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", boxShadow: "0 6px 20px rgba(120,90,40,0.25)" }}
          >
            RSVP
          </a>
        </motion.div>
      </section>

      {/* ═ STORY ═ */}
      {site.story.length > 0 && (
        <section id="story" className="px-6 py-24" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-3xl">
            <SectionTitle kicker="How it began" title="Our Story" />
            <div className="mx-auto max-w-xl space-y-6 text-center">
              {site.story.map((p, i) => (
                <motion.p key={i} {...inView} className="text-lg font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ DETAILS ═ */}
      <section id="details" className="px-6 py-24" style={{ background: "#f3ead6" }}>
        <div className="mx-auto max-w-4xl">
          <SectionTitle kicker="When &amp; where" title="The Details" />
          <div className="grid gap-6 md:grid-cols-2">
            {[site.ceremony, site.reception].map((b) => (
              <motion.div
                key={b.title}
                {...inView}
                className="rounded-2xl px-8 py-10 text-center"
                style={{ background: "#fdfaf2", border: "1px solid rgba(169,138,82,0.25)", boxShadow: "0 10px 30px rgba(120,90,40,0.06)" }}
              >
                <p className="text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "#a98a52" }}>
                  {b.title}
                </p>
                <h3 className="mt-4 text-2xl italic" style={{ color: "#463726" }}>
                  {b.venue}
                </h3>
                {b.address.map((l) => (
                  <p key={l} className="mt-1 text-sm font-light italic" style={{ color: "#6b5d4f" }}>
                    {l}
                  </p>
                ))}
                <p className="mt-4 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.28em", color: "#8f7340" }}>
                  {b.time}
                </p>
                {site.mapsUrl && (
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-[11px] font-light uppercase underline underline-offset-4" style={{ ...sans, letterSpacing: "0.2em", color: "#a98a52" }}>
                    View map
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═ SCHEDULE ═ */}
      {site.timeline.length > 0 && (
        <section id="schedule" className="px-6 py-24" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-xl">
            <SectionTitle kicker="The order of the day" title="Schedule" />
            <div className="relative mx-auto max-w-sm">
              <div className="absolute bottom-2 left-[7px] top-2 w-px" style={{ background: "rgba(169,138,82,0.35)" }} aria-hidden />
              {site.timeline.map((s) => (
                <motion.div key={s.what} {...inView} className="relative mb-8 pl-10 last:mb-0 text-left">
                  <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full" style={{ background: "#faf5ea", border: "2px solid #a98a52" }} aria-hidden />
                  <p className="text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}>
                    {s.time}
                  </p>
                  <p className="mt-1 text-xl italic" style={{ color: "#463726" }}>
                    {s.what}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ DRESS CODE ═ */}
      <section className="px-6 py-24 text-center" style={{ background: "#f3ead6" }}>
        <div className="mx-auto max-w-2xl">
          <SectionTitle kicker="What to wear" title="Dress Code" />
          <motion.p {...inView} className="text-2xl italic" style={{ color: "#463726" }}>
            {site.dressCode}
          </motion.p>
          <motion.div {...inView} className="mt-8 flex items-center justify-center gap-5">
            {[{ c: "#e8dcc0", label: "Ivory" }, { c: "#d9b975", label: "Champagne" }, { c: "#a98a52", label: "Gold" }].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full" style={{ background: s.c, boxShadow: "inset 0 2px 6px rgba(255,255,255,0.5), 0 2px 8px rgba(120,90,40,0.15)" }} />
                <span className="text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8a7a63" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
          {site.dressLadies && <motion.p {...inView} className="mt-8 text-sm font-light italic" style={{ color: "#6b5d4f" }}>Ladies — {site.dressLadies}</motion.p>}
          {site.dressGentlemen && <motion.p {...inView} className="mt-2 text-sm font-light italic" style={{ color: "#6b5d4f" }}>Gentlemen — {site.dressGentlemen}</motion.p>}
        </div>
      </section>

      {/* ═ GALLERY ═ */}
      {site.gallery.length > 0 && (
        <section id="gallery" className="px-6 py-24" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-4xl">
            <SectionTitle kicker="Moments" title="Gallery" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {site.gallery.map((src) => (
                <motion.div key={src} {...inView} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image src={src} alt="" fill className="object-cover" sizes="(min-width:640px) 30vw, 45vw" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ GIFTS ═ */}
      {site.giftNote && (
        <section className="px-6 py-24 text-center" style={{ background: "#f3ead6" }}>
          <div className="mx-auto max-w-xl">
            <SectionTitle kicker="With gratitude" title="Gifts" />
            <motion.p {...inView} className="text-lg font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>
              {site.giftNote}
            </motion.p>
            {site.giftDetails && (
              <motion.p {...inView} className="mt-5 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8f7340" }}>
                {site.giftDetails}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* ═ RSVP ═ */}
      <section id="rsvp" className="px-6 py-28 text-center" style={{ background: "radial-gradient(120% 90% at 50% 0%, #fdf9ef 0%, #f0e4ca 100%)" }}>
        <div className="mx-auto max-w-xl">
          <SectionTitle kicker="Kindly reply" title="Will You Join Us?" />
          <motion.p {...inView} className="text-lg font-light italic" style={{ color: "#6b5d4f" }}>
            We would be honoured to have you celebrate with us.
          </motion.p>
          <motion.button
            {...inView}
            onClick={() => setRsvpOpen(true)}
            className="mt-10 inline-block rounded-full px-16 py-5 text-[12px] uppercase transition-transform active:scale-95"
            style={{ ...sans, letterSpacing: "0.32em", color: "#f6efe1", background: "linear-gradient(180deg,#b7995c,#8f7340)", boxShadow: "0 8px 26px rgba(120,90,40,0.28)" }}
          >
            RSVP
          </motion.button>
          {replied && (
            <p className="mt-6 text-sm italic" style={{ color: "#8a7a63" }}>
              You replied: {replied === "yes" ? "joyfully accepting" : "regretfully declining"}
            </p>
          )}
          <p className="mt-8">
            <a href={waShare(site.blessingMessage)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-light uppercase underline underline-offset-4" style={{ ...sans, letterSpacing: "0.22em", color: "#8f7340" }}>
              Leave a blessing
            </a>
          </p>
        </div>
      </section>

      {/* ═ FAQ ═ */}
      {site.faq.length > 0 && (
        <section id="faq" className="px-6 py-24" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-2xl">
            <SectionTitle kicker="Good to know" title="Questions" />
            <div className="space-y-4">
              {site.faq.map((f) => (
                <motion.details
                  key={f.q}
                  {...inView}
                  className="group rounded-xl px-6 py-4"
                  style={{ background: "#fdfaf2", border: "1px solid rgba(169,138,82,0.22)" }}
                >
                  <summary className="cursor-pointer list-none text-[15px] italic" style={{ color: "#463726" }}>
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm font-light leading-relaxed" style={{ color: "#6b5d4f" }}>
                    {f.a}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ FOOTER ═ */}
      <footer className="px-6 py-20 text-center" style={{ background: "#efe3c9" }}>
        <p style={{ ...scriptFont, fontSize: 40, color: "#8f7340" }}>{site.coupleNames}</p>
        <p className="mt-3 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.3em", color: "#6b5d4f" }}>
          {site.dateLine}
        </p>
        <p className="mt-6 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "rgba(107,93,79,0.7)" }}>
          {site.hashtag}
        </p>
      </footer>

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
