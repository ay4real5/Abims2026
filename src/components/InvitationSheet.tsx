"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };

const Rule = () => (
  <div aria-hidden className="mx-auto my-10 flex w-full max-w-[240px] items-center gap-3">
    <div className="h-px flex-1" style={{ background: "rgba(143,115,64,0.4)" }} />
    <div className="h-1 w-1 rotate-45" style={{ background: "rgba(143,115,64,0.55)" }} />
    <div className="h-px flex-1" style={{ background: "rgba(143,115,64,0.4)" }} />
  </div>
);

/**
 * The invitation unfolded — a full sheet of stationery the card dissolves
 * into. Scrolls like reading a letter, never like a webpage.
 */
export default function InvitationSheet() {
  const reduced = useReducedMotion();

  const rsvpHref = site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.rsvpMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(site.rsvpMessage)}`;

  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    shown: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto"
      style={{ background: "linear-gradient(178deg, #f4ecda 0%, #ece0c5 60%, #e7d9ba 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 1.2, ease: "easeInOut" }}
    >
      {/* cotton grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: "160px" }}
      />
      {/* hairline frame, like a plate-printed border */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-3 z-10 rounded-[4px]"
        style={{ border: "1px solid rgba(143,115,64,0.45)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-4 z-10 rounded-[3px]"
        style={{ border: "1px solid rgba(143,115,64,0.2)" }}
      />

      <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center px-10 py-16 text-center">
        {/* monogram crest */}
        <motion.div custom={0} initial="hidden" animate="shown" variants={item}>
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ border: "1px solid rgba(143,115,64,0.5)" }}
          >
            <span className="text-xl italic" style={{ ...serif, color: "#8f7340", letterSpacing: 2 }}>
              {site.initials[0]}{site.initials[1]}
            </span>
          </div>
        </motion.div>

        <motion.p
          custom={1} initial="hidden" animate="shown" variants={item}
          className="mt-10 text-[10px] font-light uppercase"
          style={{ ...sans, letterSpacing: "0.35em", color: "#6b5d4f" }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          custom={2} initial="hidden" animate="shown" variants={item}
          className="mt-6 text-6xl font-medium italic leading-tight"
          style={{ ...serif, color: "#4a3d2c" }}
        >
          {site.coupleNames}
        </motion.h1>

        <motion.p
          custom={3} initial="hidden" animate="shown" variants={item}
          className="mt-6 text-base font-light italic"
          style={{ ...serif, color: "#6b5d4f" }}
        >
          request the honour of your presence
          <br />
          at the celebration of their marriage
        </motion.p>

        <motion.div custom={4} initial="hidden" animate="shown" variants={item} className="w-full">
          <Rule />
          <p className="text-lg italic" style={{ ...serif, color: "#4a3d2c" }}>
            {site.dateWords}
          </p>
          <p
            className="mt-3 text-[11px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.3em", color: "#8f7340" }}
          >
            {site.year}
          </p>
          <p className="mt-6 text-base font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            {site.venue}
            {site.city ? <><br />{site.city}</> : null}
          </p>
        </motion.div>

        <motion.div custom={5} initial="hidden" animate="shown" variants={item} className="w-full">
          <Rule />
          <div className="mx-auto max-w-[260px] space-y-4">
            {site.schedule.map((s) => (
              <div key={s.what} className="flex items-baseline justify-between gap-6">
                <span
                  className="text-[11px] font-light uppercase"
                  style={{ ...sans, letterSpacing: "0.25em", color: "#6b5d4f" }}
                >
                  {s.what}
                </span>
                <span className="flex-1 border-b border-dotted" style={{ borderColor: "rgba(143,115,64,0.35)" }} />
                <span className="text-sm italic" style={{ ...serif, color: "#4a3d2c" }}>
                  {s.time}
                </span>
              </div>
            ))}
          </div>
          <p
            className="mt-8 text-[11px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.3em", color: "#6b5d4f" }}
          >
            {site.dressCode}
          </p>
        </motion.div>

        <motion.div custom={6} initial="hidden" animate="shown" variants={item} className="w-full">
          <Rule />
          <p className="text-base font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            Kindly share your reply
          </p>
          <a
            href={rsvpHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full px-10 py-3.5 text-[11px] font-normal uppercase transition-opacity active:opacity-80"
            style={{
              ...sans,
              letterSpacing: "0.3em",
              color: "#f6efe1",
              background: "linear-gradient(180deg, #a98a52 0%, #8f7340 100%)",
              boxShadow: "0 2px 10px rgba(120,90,40,0.35), inset 0 1px 0 rgba(255,240,200,0.4)",
            }}
          >
            RSVP
          </a>
          {site.mapsUrl ? (
            <p className="mt-6">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-light uppercase underline underline-offset-4"
                style={{ ...sans, letterSpacing: "0.25em", color: "#8f7340" }}
              >
                View the location
              </a>
            </p>
          ) : null}
        </motion.div>

        <motion.p
          custom={7} initial="hidden" animate="shown" variants={item}
          className="mt-14 pb-4 text-[10px] font-light uppercase"
          style={{ ...sans, letterSpacing: "0.35em", color: "rgba(107,93,79,0.7)" }}
        >
          {site.hashtag}
        </motion.p>
      </div>
    </motion.div>
  );
}
