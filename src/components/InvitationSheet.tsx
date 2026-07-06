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
            <p className="text-3xl tabular-nums" style={{ ...serif, color: "#4a3d2c" }}>
              {String(c.n).padStart(2, "0")}
            </p>
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

      <div className="relative mx-auto flex min-h-full max-w-md flex-col items-center px-10 pb-20 pt-[10dvh] text-center">
        {/* ═ hero ═ */}
        <motion.div {...fadeUp}>
          <Rings />
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
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2"
            style={{
              background:
                "linear-gradient(105deg, rgba(255,236,180,0) 0%, rgba(255,236,180,0.9) 50%, rgba(255,236,180,0) 100%)",
              mixBlendMode: "overlay",
            }}
            initial={{ left: "-60%" }}
            whileInView={{ left: "115%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 1.4 }}
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
            <motion.div {...fadeUp} className="w-full">
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

        {/* ═ the day ═ */}
        {site.timeline.length > 0 && (
          <>
            <Rule />
            <motion.div {...fadeUp} className="w-full">
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
          <motion.div {...fadeUp} className="mt-10 grid w-full grid-cols-2 gap-3">
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
            <motion.div {...fadeUp} className="w-full">
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
            <motion.div {...fadeUp} className="w-full">
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
