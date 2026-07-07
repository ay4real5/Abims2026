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

/* ── the website ─────────────────────────────────────────────── */
export default function Website() {
  const reduced = useReducedMotion();
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [replied, setReplied] = useState<RsvpChoice | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

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

      {/* ═ INVITATION LINE ═ */}
      <section id="invite" className="px-6 py-24 text-center" style={{ background: "#faf5ea" }}>
        <motion.div {...reveal} className="mx-auto max-w-xl">
          <p className="mx-auto text-3xl italic" style={{ ...scriptFont, color: "#8f7340" }}>{site.initials[0]} &amp; {site.initials[1]}</p>
          <p className="mt-8 text-xl font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>
            Together with their families, they joyfully invite you to celebrate their marriage.
          </p>
          <div className="mt-12">
            <Countdown />
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
                <p className="text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.35em", color: "#a98a52" }}>{b.title}</p>
                <h3 className="mt-4 text-2xl italic" style={{ color: "#463726" }}>{b.venue}</h3>
                {b.address.map((l) => <p key={l} className="mt-1 text-sm font-light italic" style={{ color: "#6b5d4f" }}>{l}</p>)}
                <p className="mt-4 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.28em", color: "#8f7340" }}>{b.time}</p>
                {site.mapsUrl && (
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-[11px] font-light uppercase underline underline-offset-4" style={{ ...sans, letterSpacing: "0.2em", color: "#a98a52" }}>View map</a>
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
            <Title kicker="Moments" title="Gallery" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {site.photos.gallery.map((src, i) => (
                <motion.button
                  key={src + i}
                  {...reveal}
                  onClick={() => setLightbox(src)}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-xl"
                  style={{ boxShadow: "0 10px 26px rgba(120,90,40,0.12)" }}
                >
                  <Photo src={src} alt="" quality={95} sizes="(min-width:640px) 30vw, 48vw" className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]" monogram={false} />
                  <span className="pointer-events-none absolute inset-0 rounded-xl" style={{ border: "1px solid rgba(255,248,230,0.15)", boxShadow: "inset 0 0 0 1px rgba(143,115,64,0.12)" }} />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═ DRESS CODE ═ */}
      <section className="px-6 py-24 text-center" style={{ background: "#f3ead6" }}>
        <div className="mx-auto max-w-2xl">
          <Title kicker="What to wear" title="Dress Code" />
          <motion.p {...reveal} className="text-2xl italic" style={{ color: "#463726" }}>{site.dressCode}</motion.p>
          <motion.div {...reveal} className="mt-8 flex items-center justify-center gap-5">
            {[{ c: "#e8dcc0", label: "Ivory" }, { c: "#d9b975", label: "Champagne" }, { c: "#a98a52", label: "Gold" }].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full" style={{ background: s.c, boxShadow: "inset 0 2px 6px rgba(255,255,255,0.5), 0 2px 8px rgba(120,90,40,0.15)" }} />
                <span className="text-[9px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8a7a63" }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
          {site.dressLadies && <motion.p {...reveal} className="mt-8 text-sm font-light italic" style={{ color: "#6b5d4f" }}>Ladies — {site.dressLadies}</motion.p>}
          {site.dressGentlemen && <motion.p {...reveal} className="mt-2 text-sm font-light italic" style={{ color: "#6b5d4f" }}>Gentlemen — {site.dressGentlemen}</motion.p>}
        </div>
      </section>

      {/* ═ GIFTS ═ */}
      {site.giftNote && (
        <section className="px-6 py-24 text-center" style={{ background: "#faf5ea" }}>
          <div className="mx-auto max-w-xl">
            <Title kicker="With gratitude" title="Gifts" />
            <motion.p {...reveal} className="text-lg font-light italic leading-relaxed" style={{ color: "#5b4a35" }}>{site.giftNote}</motion.p>
            {site.giftDetails && <motion.p {...reveal} className="mt-5 text-[12px] font-light uppercase" style={{ ...sans, letterSpacing: "0.2em", color: "#8f7340" }}>{site.giftDetails}</motion.p>}
          </div>
        </section>
      )}

      {/* ═ RSVP (full-bleed photo band) ═ */}
      <section id="rsvp" className="relative overflow-hidden px-6 py-32 text-center">
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.06] }}
          transition={{ duration: 22, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <Photo src={site.photos.rsvp} alt="" quality={95} sizes="100vw" className="h-full w-full" monogram={!site.photos.rsvp} position="center 35%" />
        </motion.div>
        <div className="absolute inset-0" style={{ background: site.photos.rsvp ? "linear-gradient(180deg, rgba(24,16,6,0.66), rgba(24,16,6,0.78))" : "rgba(30,22,10,0.35)" }} />
        <div className="relative mx-auto max-w-xl">
          <Title kicker="Kindly reply" title="Will You Join Us?" light />
          <motion.p {...reveal} className="text-lg font-light italic" style={{ color: "#fbf1da" }}>We would be honoured to celebrate this day with you.</motion.p>
          <motion.button
            {...reveal}
            onClick={() => setRsvpOpen(true)}
            className="mt-10 inline-block rounded-full px-16 py-5 text-[12px] uppercase transition-transform active:scale-95"
            style={{ ...sans, letterSpacing: "0.32em", color: "#3a2c14", background: "linear-gradient(180deg,#f0dca6,#d9b975)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
          >
            RSVP
          </motion.button>
          {replied && <p className="mt-6 text-sm italic" style={{ color: "#e7d4a6" }}>You replied: {replied === "yes" ? "joyfully accepting" : "regretfully declining"}</p>}
          <p className="mt-8">
            <a href={waShare(site.blessingMessage)} target="_blank" rel="noopener noreferrer" className="text-[11px] font-light uppercase underline underline-offset-4" style={{ ...sans, letterSpacing: "0.22em", color: "#f0dca6" }}>Leave a blessing</a>
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
