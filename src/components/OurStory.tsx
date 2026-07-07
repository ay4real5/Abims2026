"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { site } from "@/config/site";
import Photo from "./Photo";

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

/* ═══════════════════════════════════════════════════════════════
   Desktop: pinned photo that cross-fades while the chapters scroll,
   with a gold thread that draws itself down the column.
   ═══════════════════════════════════════════════════════════════ */
function Scrolly({ chapters }: { chapters: Chapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const N = chapters.length;

  // One opacity band per photo → smooth cross-fade as you scroll.
  // Framer compiles this into a native scroll-timeline, so every offset MUST
  // stay within [0,1]; the first photo starts visible and the last stays visible.
  const f = 0.5 / N;
  const opacities = chapters.map((_, i) => {
    const start = i / N;
    const end = (i + 1) / N;
    let input: number[];
    let output: number[];
    if (i === 0) {
      input = [0, end, end + f];
      output = [1, 1, 0];
    } else if (i === N - 1) {
      input = [start - f, start, 1];
      output = [0, 1, 1];
    } else {
      input = [start - f, start, end, end + f];
      output = [0, 1, 1, 0];
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollYProgress, input, output, { clamp: true });
  });

  return (
    <div ref={ref} className="relative mx-auto grid max-w-6xl grid-cols-2 gap-14 px-6 pb-24">
      {/* LEFT — sticky, cross-fading photo */}
      <div>
        <div className="sticky top-0 flex h-screen items-center">
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 24px 60px rgba(120,90,40,0.22)" }}
          >
            {chapters.map((c, i) => (
              <motion.div key={i} className="absolute inset-0" style={{ opacity: opacities[i] }}>
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.08] }}
                  transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                >
                  <Photo src={c.photo} alt={c.chapter} quality={95} sizes="45vw" className="h-full w-full" />
                </motion.div>
              </motion.div>
            ))}
            <span className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(143,115,64,0.25)" }} />
          </div>
        </div>
      </div>

      {/* RIGHT — chapters + drawing thread */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute -left-7 top-0 h-full w-4"
          viewBox="0 0 4 100"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <line x1="2" y1="0" x2="2" y2="100" stroke="rgba(169,138,82,0.22)" strokeWidth="0.35" />
          <motion.line
            x1="2"
            y1="0"
            x2="2"
            y2="100"
            stroke="#c8a25c"
            strokeWidth="0.6"
            strokeLinecap="round"
            style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
          />
        </svg>

        {chapters.map((c, i) => (
          <div key={i} className="flex min-h-screen flex-col justify-center py-16">
            <ChapterLabel c={c} />
            <Words text={c.lines} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Mobile / reduced motion: clean stacked chapters (photo over text).
   ═══════════════════════════════════════════════════════════════ */
function Stacked({ chapters, reduced }: { chapters: Chapter[]; reduced: boolean }) {
  return (
    <div className="mx-auto max-w-md space-y-20 px-6 pb-20">
      {chapters.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? undefined : { y: 26, opacity: 0 }}
          whileInView={reduced ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div
            className="relative mb-7 aspect-[4/5] w-full overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 18px 44px rgba(120,90,40,0.18)" }}
          >
            <Photo src={c.photo} alt={c.chapter} quality={95} sizes="90vw" className="h-full w-full" />
            <span className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(143,115,64,0.22)" }} />
          </div>
          <ChapterLabel c={c} center />
          {reduced ? <PlainText text={c.lines} center /> : <Words text={c.lines} center />}
        </motion.div>
      ))}
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
  const [desktop, setDesktop] = useState(false);
  const chapters = site.story as unknown as Chapter[];

  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  if (!chapters.length) return null;

  return (
    <section id="story" className="px-0 pt-24" style={{ background: "#f3ead6" }}>
      <div className="px-6">
        <Heading />
      </div>
      {desktop && !reduced ? (
        <Scrolly chapters={chapters} />
      ) : (
        <Stacked chapters={chapters} reduced={!!reduced} />
      )}
    </section>
  );
}
