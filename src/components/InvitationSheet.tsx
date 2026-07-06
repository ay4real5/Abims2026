"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { site } from "@/config/site";
import RsvpModal, { type RsvpChoice } from "./RsvpModal";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };
const scriptFont = { fontFamily: "var(--font-script), cursive" };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
};

/** Divider that draws itself in, with a slowly turning gold diamond. */
const Rule = () => (
  <div aria-hidden className="mx-auto my-12 flex w-full max-w-[220px] items-center gap-3">
    <motion.div
      className="h-px flex-1 origin-right"
      style={{ background: "rgba(143,115,64,0.4)" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
    />
    <motion.div
      className="h-1.5 w-1.5"
      style={{ background: "rgba(143,115,64,0.55)" }}
      animate={{ rotate: [45, 225, 405] }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="h-px flex-1 origin-left"
      style={{ background: "rgba(143,115,64,0.4)" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
    />
  </div>
);

/**
 * Ambient life for the whole sheet — champagne bokeh drifting up slowly and
 * gold motes twinkling forever. Fixed to the viewport, behind the content.
 */
const BOKEH = [
  { x: 8, y: 85, s: 90, d: 26, delay: 0, o: 0.10 },
  { x: 78, y: 92, s: 130, d: 32, delay: 4, o: 0.08 },
  { x: 30, y: 96, s: 70, d: 22, delay: 8, o: 0.12 },
  { x: 60, y: 88, s: 100, d: 28, delay: 12, o: 0.09 },
  { x: 90, y: 95, s: 60, d: 20, delay: 16, o: 0.11 },
];
const MOTES = [
  { x: 12, y: 30, s: 5, d: 7, delay: 0 },
  { x: 85, y: 20, s: 4, d: 9, delay: 1.5 },
  { x: 25, y: 60, s: 6, d: 8, delay: 3 },
  { x: 70, y: 45, s: 4, d: 10, delay: 2 },
  { x: 45, y: 75, s: 5, d: 7.5, delay: 4.5 },
  { x: 92, y: 65, s: 4, d: 9.5, delay: 6 },
  { x: 8, y: 80, s: 5, d: 8.5, delay: 5 },
  { x: 55, y: 15, s: 4, d: 11, delay: 7 },
];

function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* light that never stops moving across the paper */}
      <motion.div
        className="absolute -inset-[30%]"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 40%, rgba(255,241,204,0.5) 0%, rgba(255,241,204,0) 70%)",
        }}
        animate={{ x: ["-12%", "12%", "-12%"], y: ["-6%", "8%", "-6%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* champagne bokeh rising */}
      {BOKEH.map((b, i) => (
        <motion.div
          key={`bk${i}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.s,
            height: b.s,
            background:
              "radial-gradient(circle at 35% 35%, rgba(212,178,110,0.5), rgba(212,178,110,0.08) 70%)",
            filter: "blur(6px)",
            opacity: b.o,
          }}
          animate={{ y: ["0vh", "-110vh"], x: [0, 18, -12, 8, 0] }}
          transition={{ duration: b.d, delay: b.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* gold motes twinkling */}
      {MOTES.map((m, i) => (
        <motion.div
          key={`mt${i}`}
          className="absolute rounded-full"
          style={{
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.s,
            height: m.s,
            background: "#d9b975",
            boxShadow: "0 0 8px 2px rgba(217,185,117,0.6)",
          }}
          animate={{
            opacity: [0, 0.9, 0.2, 0.8, 0],
            y: [0, -14, -26, -38, -50],
            x: [0, 6, -4, 5, 0],
            scale: [0.6, 1, 0.8, 1, 0.5],
          }}
          transition={{ duration: m.d, delay: m.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const Heading = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[10px] font-light uppercase"
    style={{ ...sans, letterSpacing: "0.4em", color: "#8f7340" }}
  >
    {children}
  </p>
);

/** Thin interlocked wedding rings that draw themselves in gold line. */
const Rings = () => (
  <svg viewBox="0 0 120 70" className="mx-auto h-14 w-auto" aria-hidden>
    <motion.circle
      cx="48" cy="38" r="24" fill="none" stroke="#a98a52" strokeWidth="1.6"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.circle
      cx="72" cy="38" r="24" fill="none" stroke="#8f7340" strokeWidth="1.2" opacity="0.8"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: "easeInOut", delay: 0.7 }}
    />
    <motion.path
      d="M48 10 l4 5 -4 5 -4 -5 Z" fill="none" stroke="#a98a52" strokeWidth="1.2"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 1.9 }}
    />
  </svg>
);

/** Live countdown to the ceremony, set in stationery numerals. */
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

  if (!left) return <div className="h-16" aria-hidden />;

  const cells = [
    { n: left.d, label: "days" },
    { n: left.h, label: "hours" },
    { n: left.m, label: "minutes" },
    { n: left.s, label: "seconds" },
  ];

  return (
    <div className="mx-auto flex max-w-[320px] items-start justify-center">
      {cells.map((c, i) => (
        <div key={c.label} className="flex items-start">
          {i > 0 && (
            <span aria-hidden className="mx-3 mt-1 text-xl" style={{ ...serif, color: "rgba(143,115,64,0.5)" }}>
              ·
            </span>
          )}
          <div className="text-center">
            <div className="relative h-9 overflow-hidden">
              <motion.p
                key={c.n}
                className="text-3xl tabular-nums"
                style={{ ...serif, color: "#4a3d2c" }}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {String(c.n).padStart(2, "0")}
              </motion.p>
            </div>
            <p
              className="mt-1 text-[9px] font-light uppercase"
              style={{ ...sans, letterSpacing: "0.25em", color: "#8a7a63" }}
            >
              {c.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VenueBlock({
  block,
}: {
  block: { title: string; venue: string; address: string[]; time: string };
}) {
  return (
    <motion.div {...fadeUp} className="w-full">
      <Heading>{block.title}</Heading>
      <p className="mt-4 text-2xl italic" style={{ ...serif, color: "#4a3d2c" }}>
        {block.venue}
      </p>
      {block.address.map((line) => (
        <p key={line} className="mt-1 text-sm font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
          {line}
        </p>
      ))}
      <p
        className="mt-3 text-[11px] font-light uppercase"
        style={{ ...sans, letterSpacing: "0.3em", color: "#8a7a63" }}
      >
        {block.time}
      </p>
    </motion.div>
  );
}

function waShare(message: string) {
  const text = encodeURIComponent(message);
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

/** Elegant hairline navigation — appears once the letter has settled. */
function SheetNav() {
  const items = [
    { id: "home", label: "Home" },
    ...(site.story.length ? [{ id: "story", label: "Story" }] : []),
    { id: "details", label: "Details" },
    ...(site.timeline.length ? [{ id: "day", label: "The Day" }] : []),
    ...(site.gallery.length ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(site.giftNote ? [{ id: "gifts", label: "Gifts" }] : []),
    ...(site.faq.length ? [{ id: "faq", label: "Questions" }] : []),
    { id: "rsvp", label: "RSVP" },
  ];
  return (
    <motion.nav
      className="sticky top-0 z-20 -mx-10 mb-4"
      style={{
        background: "rgba(246,239,223,0.88)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(143,115,64,0.3)",
      }}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <div className="scrollbar-none flex items-center gap-6 overflow-x-auto px-6 py-3 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="text-[9px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340" }}
          >
            {it.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}

/**
 * The invitation, unfolded — one long sheet of stationery that doubles as
 * the website: sticky nav + anchored sections once `active`.
 */
export default function InvitationSheet({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [replied, setReplied] = useState<RsvpChoice | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("abims-rsvp");
    if (saved === "yes" || saved === "no") setReplied(saved);
  }, []);

  const onChoose = (choice: RsvpChoice) => {
    setReplied(choice);
    localStorage.setItem("abims-rsvp", choice);
  };

  return (
    <div
      className={`fixed inset-0 z-0 scroll-smooth ${active ? "overflow-y-auto" : "overflow-hidden"}`}
      style={{
        background: "linear-gradient(178deg, #f6efdf 0%, #efe4cb 60%, #e9dcbd 100%)",
        pointerEvents: active ? "auto" : "none",
      }}
      aria-hidden={!active}
    >
      {/* cotton grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "160px" }}
      />
      {/* the sheet breathes — drifting light, bokeh, twinkling motes */}
      {active && !reduced && <Ambient />}
      {/* plate-printed hairline frame */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-3 z-10 rounded-[4px]"
        style={{ border: "1px solid rgba(143,115,64,0.45)" }}
      />

      <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center px-10 pb-20 pt-[4dvh] text-center">
        {active && <SheetNav />}

        {/* ═ hero ═ */}
        <div id="home" className="h-[4dvh]" aria-hidden />
        <motion.div {...fadeUp}>
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 1.2, 0, -1.2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rings />
          </motion.div>
          <p
            className="mt-8 text-[10px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.4em", color: "#8f7340" }}
          >
            We're getting married
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="relative mt-8 overflow-hidden px-2">
          <h1
            className="leading-tight"
            style={{ ...scriptFont, fontSize: "clamp(40px, 12vw, 64px)", color: "#4a3d2c" }}
          >
            {site.coupleNames}
          </h1>
          {/* shimmer returns every few seconds — the names never sit still */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,236,180,0) 0%, rgba(255,236,180,0.9) 50%, rgba(255,236,180,0) 100%)",
              mixBlendMode: "overlay",
            }}
            animate={{ left: ["-60%", "115%"] }}
            transition={{ duration: 2, ease: "easeInOut", delay: 1.4, repeat: Infinity, repeatDelay: 3.5 }}
          />
        </motion.div>

        <motion.div {...fadeUp} className="w-full">
          <p className="mt-6 text-base font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            request the honour of your presence
            <br />
            at the celebration of their marriage
          </p>
          <p className="mt-8 text-xl italic" style={{ ...serif, color: "#4a3d2c" }}>
            {site.dateWords}
          </p>
          <p
            className="mt-2 text-[11px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340" }}
          >
            {site.year}
          </p>
        </motion.div>

        {/* ═ countdown ═ */}
        <motion.div {...fadeUp} className="mt-12 w-full">
          <Countdown />
        </motion.div>

        {/* ═ our story ═ */}
        {site.story.length > 0 && (
          <>
            <Rule />
            <motion.div id="story" {...fadeUp} className="w-full scroll-mt-16">
              <Heading>Our story</Heading>
              {site.story.map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="mt-5 text-[15px] font-light italic leading-relaxed"
                  style={{ ...serif, color: "#6b5d4f" }}
                >
                  {p}
                </p>
              ))}
            </motion.div>
          </>
        )}

        {/* ═ venues ═ */}
        <Rule />
        <div id="details" className="w-full scroll-mt-16">
        <VenueBlock block={site.ceremony} />
        <Rule />
        <VenueBlock block={site.reception} />
        {site.mapsUrl ? (
          <motion.p {...fadeUp} className="mt-8">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light uppercase underline underline-offset-4"
              style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
            >
              View the location
            </a>
          </motion.p>
        ) : null}
        </div>

        {/* ═ the day ═ */}
        {site.timeline.length > 0 && (
          <>
            <Rule />
            <motion.div id="day" {...fadeUp} className="w-full scroll-mt-16">
              <Heading>The day</Heading>
              <div className="mx-auto mt-6 max-w-[280px] space-y-4">
                {site.timeline.map((s) => (
                  <div key={s.what} className="flex items-baseline justify-between gap-6">
                    <span className="text-sm italic" style={{ ...serif, color: "#4a3d2c" }}>
                      {s.time}
                    </span>
                    <span
                      className="flex-1 border-b border-dotted"
                      style={{ borderColor: "rgba(143,115,64,0.35)" }}
                    />
                    <span
                      className="text-[11px] font-light uppercase"
                      style={{ ...sans, letterSpacing: "0.2em", color: "#6b5d4f" }}
                    >
                      {s.what}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ═ dress code ═ */}
        <Rule />
        <motion.div {...fadeUp} className="w-full">
          <Heading>Dress code</Heading>
          <p className="mt-5 text-xl italic" style={{ ...serif, color: "#4a3d2c" }}>
            {site.dressCode}
          </p>
          {site.dressLadies && (
            <p className="mt-4 text-sm font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
              Ladies — {site.dressLadies}
            </p>
          )}
          {site.dressGentlemen && (
            <p className="mt-2 text-sm font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
              Gentlemen — {site.dressGentlemen}
            </p>
          )}
        </motion.div>

        {/* ═ gallery ═ */}
        {site.gallery.length > 0 && (
          <motion.div id="gallery" {...fadeUp} className="mt-10 grid w-full scroll-mt-16 grid-cols-2 gap-3">
            {site.gallery.map((src) => (
              <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image src={src} alt="" fill className="object-cover" sizes="45vw" />
              </div>
            ))}
          </motion.div>
        )}

        {/* ═ gifts ═ */}
        {site.giftNote && (
          <>
            <Rule />
            <motion.div id="gifts" {...fadeUp} className="w-full scroll-mt-16">
              <Heading>Gifts</Heading>
              <p
                className="mx-auto mt-5 max-w-[300px] text-[15px] font-light italic leading-relaxed"
                style={{ ...serif, color: "#6b5d4f" }}
              >
                {site.giftNote}
              </p>
              {site.giftDetails && (
                <p
                  className="mt-4 text-[11px] font-light uppercase"
                  style={{ ...sans, letterSpacing: "0.2em", color: "#8f7340" }}
                >
                  {site.giftDetails}
                </p>
              )}
            </motion.div>
          </>
        )}

        {/* ═ rsvp ═ */}
        <Rule />
        <motion.div id="rsvp" {...fadeUp} className="w-full scroll-mt-16">
          <p className="text-base font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            Please confirm your attendance
          </p>
          <motion.button
            onClick={() => setRsvpOpen(true)}
            className="mt-6 inline-block rounded-full px-12 py-4 text-[11px] uppercase active:scale-95"
            style={{
              ...sans,
              letterSpacing: "0.3em",
              color: "#f6efe1",
              background: "linear-gradient(180deg, #a98a52 0%, #8f7340 100%)",
            }}
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                "0 2px 10px rgba(120,90,40,0.35), 0 0 0px rgba(217,185,117,0), inset 0 1px 0 rgba(255,240,200,0.4)",
                "0 2px 14px rgba(120,90,40,0.45), 0 0 24px rgba(217,185,117,0.55), inset 0 1px 0 rgba(255,240,200,0.4)",
                "0 2px 10px rgba(120,90,40,0.35), 0 0 0px rgba(217,185,117,0), inset 0 1px 0 rgba(255,240,200,0.4)",
              ],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            RSVP
          </motion.button>
          {replied && (
            <p className="mt-5 text-sm italic" style={{ ...serif, color: "#8a7a63" }}>
              You replied: {replied === "yes" ? "joyfully accepting" : "regretfully declining"}
            </p>
          )}
          <p className="mt-6">
            <a
              href={waShare(site.blessingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light uppercase underline underline-offset-4"
              style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
            >
              Leave a blessing
            </a>
          </p>
        </motion.div>

        {/* ═ faq ═ */}
        {site.faq.length > 0 && (
          <>
            <Rule />
            <motion.div id="faq" {...fadeUp} className="w-full scroll-mt-16">
              <Heading>Questions</Heading>
              <div className="mt-6 space-y-6 text-left">
                {site.faq.map((f) => (
                  <div key={f.q}>
                    <p className="text-[15px] italic" style={{ ...serif, color: "#4a3d2c" }}>
                      {f.q}
                    </p>
                    <p className="mt-1 text-sm font-light leading-relaxed" style={{ ...serif, color: "#6b5d4f" }}>
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ═ footer ═ */}
        <motion.div {...fadeUp} className="mt-16">
          <p style={{ ...scriptFont, fontSize: 34, color: "#8f7340" }}>with love</p>
          <p
            className="mt-4 text-[10px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.35em", color: "rgba(107,93,79,0.7)" }}
          >
            {site.hashtag}
          </p>
        </motion.div>
      </div>

      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} onChoose={onChoose} />
    </div>
  );
}
