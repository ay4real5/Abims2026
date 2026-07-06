"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const Rule = () => (
  <div aria-hidden className="mx-auto my-12 flex w-full max-w-[220px] items-center gap-3">
    <div className="h-px flex-1" style={{ background: "rgba(143,115,64,0.4)" }} />
    <div className="h-1 w-1 rotate-45" style={{ background: "rgba(143,115,64,0.55)" }} />
    <div className="h-px flex-1" style={{ background: "rgba(143,115,64,0.4)" }} />
  </div>
);

/** Thin interlocked wedding rings, hand-drawn in gold line. */
const Rings = () => (
  <svg viewBox="0 0 120 70" className="mx-auto h-14 w-auto" aria-hidden>
    <circle cx="48" cy="38" r="24" fill="none" stroke="#a98a52" strokeWidth="1.6" />
    <circle cx="72" cy="38" r="24" fill="none" stroke="#8f7340" strokeWidth="1.2" opacity="0.8" />
    {/* diamond glint */}
    <path d="M48 10 l4 5 -4 5 -4 -5 Z" fill="none" stroke="#a98a52" strokeWidth="1.2" />
  </svg>
);

function VenueBlock({
  block,
}: {
  block: { title: string; venue: string; address: string[]; time: string };
}) {
  return (
    <motion.div {...fadeUp} className="w-full">
      <p
        className="text-[10px] font-light uppercase"
        style={{ ...sans, letterSpacing: "0.35em", color: "#8f7340" }}
      >
        {block.title}
      </p>
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

/**
 * The invitation, unfolded — one long sheet of stationery.
 * `active` unlocks scrolling once the envelope has fallen away.
 */
export default function InvitationSheet({ active }: { active: boolean }) {
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
      className={`fixed inset-0 z-0 ${active ? "overflow-y-auto" : "overflow-hidden"}`}
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
      {/* plate-printed hairline frame */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-3 z-10 rounded-[4px]"
        style={{ border: "1px solid rgba(143,115,64,0.45)" }}
      />

      <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center px-10 pb-20 pt-[12dvh] text-center">
        <motion.div {...fadeUp}>
          <Rings />
          <p
            className="mt-8 text-[10px] font-light uppercase"
            style={{ ...sans, letterSpacing: "0.4em", color: "#8f7340" }}
          >
            We're getting married
          </p>
        </motion.div>

        <motion.h1
          {...fadeUp}
          className="mt-8 leading-tight"
          style={{ ...scriptFont, fontSize: "clamp(44px, 13vw, 64px)", color: "#4a3d2c" }}
        >
          {site.coupleNames}
        </motion.h1>

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

        <Rule />
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

        <Rule />
        <motion.p
          {...fadeUp}
          className="text-[11px] font-light uppercase"
          style={{ ...sans, letterSpacing: "0.3em", color: "#6b5d4f" }}
        >
          {site.dressCode}
        </motion.p>

        {site.gallery.length > 0 && (
          <motion.div {...fadeUp} className="mt-10 grid w-full grid-cols-2 gap-3">
            {site.gallery.map((src) => (
              <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                <Image src={src} alt="" fill className="object-cover" sizes="45vw" />
              </div>
            ))}
          </motion.div>
        )}

        <Rule />
        <motion.div {...fadeUp} className="w-full">
          <p className="text-base font-light italic" style={{ ...serif, color: "#6b5d4f" }}>
            Please confirm your attendance
          </p>
          <button
            onClick={() => setRsvpOpen(true)}
            className="mt-6 inline-block rounded-full px-12 py-4 text-[11px] uppercase transition-transform active:scale-95"
            style={{
              ...sans,
              letterSpacing: "0.3em",
              color: "#f6efe1",
              background: "linear-gradient(180deg, #a98a52 0%, #8f7340 100%)",
              boxShadow: "0 2px 10px rgba(120,90,40,0.35), inset 0 1px 0 rgba(255,240,200,0.4)",
            }}
          >
            RSVP
          </button>
          {replied && (
            <p className="mt-5 text-sm italic" style={{ ...serif, color: "#8a7a63" }}>
              You replied: {replied === "yes" ? "joyfully accepting" : "regretfully declining"}
            </p>
          )}
        </motion.div>

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
