"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/config/site";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };
const scriptFont = { fontFamily: "var(--font-script), cursive" };
const EASE = [0.22, 1, 0.36, 1] as const;

type Chapter = (typeof site.story)[number];

/* ── section heading (matches Website.tsx <Title>) ─────────────── */
function Heading() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="mb-4 text-center"
    >
      <p className="text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.42em", color: "#a98a52" }}>
        How it began
      </p>
      <h2 className="mt-3 text-4xl italic sm:text-5xl" style={{ ...serif, color: "#463726" }}>
        Our Story
      </h2>
      <div className="mx-auto mt-5 flex w-28 items-center gap-2">
        <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.5)" }} />
        <span style={{ color: "#a98a52" }}>&#10022;</span>
        <div className="h-px flex-1" style={{ background: "rgba(169,138,82,0.5)" }} />
      </div>
    </motion.div>
  );
}

/* ── chapter label: script numeral + title ─────────────────────── */
function ChapterLabel({ c, center }: { c: Chapter; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <span className="block text-5xl leading-none sm:text-6xl" style={{ ...scriptFont, color: "#c8a25c" }}>
        {c.numeral}
      </span>
      <p className="mt-3 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.34em", color: "#8f7340" }}>
        {c.chapter}
      </p>
    </div>
  );
}

/* ── word-by-word reveal (transform/opacity only) ──────────────── */
function Words({ text, center }: { text: string; center?: boolean }) {
  const words = text.split(" ");
  return (
    <motion.p
      className={`mt-5 text-xl font-light italic leading-relaxed sm:text-2xl ${center ? "text-center" : ""}`}
      style={{ ...serif, color: "#5b4a35" }}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, margin: "-15%" }}
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hide: { opacity: 0, y: 14, filter: "blur(4px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
          }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ── plain (reduced-motion) text — always visible ──────────────── */
function PlainText({ text, center }: { text: string; center?: boolean }) {
  return (
    <p
      className={`mt-5 text-xl font-light italic leading-relaxed sm:text-2xl ${center ? "text-center" : ""}`}
      style={{ ...serif, color: "#5b4a35" }}
    >
      {text}
    </p>
  );
}

function StoryCard({ c, index, reduced }: { c: Chapter; index: number; reduced: boolean }) {
  const alignRight = index % 2 === 1;
  return (
    <motion.article
      initial={reduced ? undefined : { opacity: 0, y: 34 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, ease: EASE }}
      className={`relative mx-auto max-w-3xl rounded-[2rem] border px-7 py-10 shadow-[0_24px_70px_rgba(91,67,38,0.12)] sm:px-12 sm:py-12 ${alignRight ? "md:ml-auto" : "md:mr-auto"}`}
      style={{ background: "linear-gradient(145deg, rgba(255,250,238,0.96), rgba(245,231,198,0.9))", borderColor: "rgba(200,162,92,0.28)" }}
    >
      <span className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-sm" style={{ ...serif, background: "#c8a25c", color: "#fff8e8", boxShadow: "0 14px 30px rgba(143,115,64,0.28)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="mx-auto max-w-2xl text-center">
        <ChapterLabel c={c} center />
        {reduced ? <PlainText text={c.lines} center /> : <Words text={c.lines} center />}
      </div>
      <div className="mx-auto mt-8 flex w-24 items-center gap-2">
        <span className="h-px flex-1" style={{ background: "rgba(169,138,82,0.35)" }} />
        <span className="text-lg leading-none" style={{ color: "#b4564b" }}>♥</span>
        <span className="h-px flex-1" style={{ background: "rgba(169,138,82,0.35)" }} />
      </div>
    </motion.article>
  );
}

function StoryList({ chapters, reduced }: { chapters: Chapter[]; reduced: boolean }) {
  return (
    <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-12">
      <div className="pointer-events-none absolute left-1/2 top-12 hidden h-[calc(100%-9rem)] w-px -translate-x-1/2 md:block" style={{ background: "linear-gradient(180deg, rgba(200,162,92,0), rgba(200,162,92,0.55), rgba(200,162,92,0))" }} />
      <div className="space-y-12 md:space-y-20">
        {chapters.map((c, i) => (
          <StoryCard key={i} c={c} index={i} reduced={reduced} />
        ))}
      </div>
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 24 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto mt-16 max-w-2xl px-6 text-center md:mt-24"
      >
        <span className="block text-3xl leading-none" style={{ color: "#c8a25c" }}>❝</span>
        <p className="mt-3 text-xl font-light italic leading-relaxed sm:text-2xl" style={{ ...serif, color: "#5b4a35" }}>
          He has made everything beautiful in its time.
        </p>
        <p className="mt-4 text-[11px] font-light uppercase" style={{ ...sans, letterSpacing: "0.34em", color: "#8f7340" }}>
          Ecclesiastes 3:11
        </p>
      </motion.div>
    </div>
  );
}

/**
 * "Our Story" — a scroll-driven, chapter-by-chapter sequence framed around how
 * the couple met (an interview → friends → the proposal → forever). On desktop
 * the photo pins and cross-fades while the chapters scroll and a gold thread
 * draws down the column; on mobile / reduced-motion it falls back to a clean
 * stacked reveal so every guest can read it.
 */
export default function OurStory() {
  const reduced = useReducedMotion();
  const chapters = site.story as unknown as Chapter[];

  if (!chapters.length) return null;

  return (
    <section id="story" className="relative overflow-hidden px-0 pt-24" style={{ background: "linear-gradient(180deg, #f3ead6 0%, #fff8e8 48%, #efe1bf 100%)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 18% 12%, rgba(200,162,92,0.24), transparent 28%), radial-gradient(circle at 82% 36%, rgba(180,86,75,0.12), transparent 30%)" }} />
      <div className="relative px-6">
        <Heading />
      </div>
      <div className="relative mx-auto mt-5 max-w-2xl px-6 text-center">
        <p className="text-base font-light leading-relaxed sm:text-lg" style={{ ...serif, color: "#6b5638" }}>
          A quiet timeline of the moments that carried us from a first meeting to forever.
        </p>
      </div>
      <StoryList chapters={chapters} reduced={!!reduced} />
    </section>
  );
}
