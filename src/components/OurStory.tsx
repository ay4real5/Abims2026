"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { site } from "@/config/site";

const serif = { fontFamily: "var(--font-serif)" };
const sans = { fontFamily: "var(--font-sans)" };
const scriptFont = { fontFamily: "var(--font-script), cursive" };
const EASE = [0.22, 1, 0.36, 1] as const;

type Chapter = (typeof site.story)[number];

const HEART_POINTS = Array.from({ length: 24 }, (_, i) => {
  const t = (i / 24) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x, y, delay: i * 0.035 };
});

function StoryVisual({ chapter, active = true }: { chapter: Chapter; active?: boolean }) {
  const isInterview = chapter.chapter.toLowerCase().includes("interview");
  const isFriends = chapter.chapter.toLowerCase().includes("friends");
  const isQuestion = chapter.chapter.toLowerCase().includes("question");

  return (
    <motion.div
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl"
      style={{ background: "radial-gradient(circle at 50% 32%, #fff9ea 0%, #ead7ad 48%, #b99049 100%)", boxShadow: "0 24px 60px rgba(120,90,40,0.22)" }}
      animate={active ? { scale: [1, 1.012, 1] } : { scale: 1 }}
      transition={{ duration: 7, repeat: active ? Infinity : 0, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff 0 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <motion.div
        className="absolute inset-6 rounded-[28px]"
        style={{ border: "1px solid rgba(255,250,238,0.5)", boxShadow: "inset 0 0 80px rgba(255,250,238,0.25)" }}
        animate={active ? { opacity: [0.45, 0.8, 0.45] } : { opacity: 0.55 }}
        transition={{ duration: 4.8, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      />

      {isInterview && (
        <div className="relative h-full w-full">
          <motion.div
            className="absolute left-[16%] top-[18%] h-[58%] w-[54%] rounded-xl bg-[#fff8e8] p-5"
            style={{ boxShadow: "0 24px 50px rgba(74,48,16,0.24)", rotate: -4 }}
            initial={{ opacity: 0, y: 28, rotate: -9 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {[0, 1, 2, 3].map((line) => (
              <motion.span
                key={line}
                className="mb-4 block h-2 rounded-full"
                style={{ background: line === 1 ? "#c8a25c" : "rgba(91,74,53,0.2)", width: `${86 - line * 12}%` }}
                animate={active ? { scaleX: [0.25, 1, 1], opacity: [0.35, 1, 0.65] } : { scaleX: 1 }}
                transition={{ duration: 2.5, delay: line * 0.28, repeat: active ? Infinity : 0, repeatDelay: 2.8, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
          <motion.div
            className="absolute right-[18%] top-[32%] flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(145deg,#f3d58d,#a9843f)", boxShadow: "0 16px 36px rgba(85,55,17,0.3)" }}
            animate={active ? { y: [0, -8, 0], rotate: [-4, 4, -4] } : { y: 0 }}
            transition={{ duration: 3.2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
          >
            <span className="text-4xl" style={{ ...serif, color: "#fff8e8" }}>?</span>
          </motion.div>
          <motion.div className="absolute bottom-[22%] right-[22%] h-1 w-24 rounded-full bg-[#8f7340]" animate={active ? { scaleX: [0, 1, 0.2], opacity: [0, 0.8, 0] } : { scaleX: 1 }} transition={{ duration: 2.2, repeat: active ? Infinity : 0, ease: "easeInOut" }} />
        </div>
      )}

      {isFriends && (
        <div className="relative h-full w-full">
          {[0, 1, 2, 3].map((bubble) => (
            <motion.div
              key={bubble}
              className="absolute rounded-3xl px-5 py-4"
              style={{
                left: bubble % 2 ? "38%" : "13%",
                top: `${18 + bubble * 15}%`,
                maxWidth: "58%",
                background: bubble % 2 ? "#fff8e8" : "#8f7340",
                color: bubble % 2 ? "#5b4a35" : "#fff8e8",
                boxShadow: "0 18px 35px rgba(74,48,16,0.18)",
              }}
              initial={{ opacity: 0, y: 22, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: bubble * 0.15, ease: EASE }}
              animate={active ? { y: [0, bubble % 2 ? -7 : 7, 0] } : { y: 0 }}
            >
              <span className="block h-2 rounded-full" style={{ width: bubble % 2 ? 92 : 70, background: bubble % 2 ? "rgba(143,115,64,0.35)" : "rgba(255,248,232,0.55)" }} />
              <span className="mt-2 block h-2 rounded-full" style={{ width: bubble % 2 ? 62 : 94, background: bubble % 2 ? "rgba(143,115,64,0.22)" : "rgba(255,248,232,0.38)" }} />
            </motion.div>
          ))}
          <motion.div className="absolute bottom-[13%] left-1/2 h-16 w-px bg-[#fff8e8]" animate={active ? { scaleY: [0.25, 1, 0.25], opacity: [0.2, 0.8, 0.2] } : { scaleY: 1 }} transition={{ duration: 3, repeat: active ? Infinity : 0, ease: "easeInOut" }} />
        </div>
      )}

      {isQuestion && (
        <div className="relative h-full w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            {HEART_POINTS.map((p, i) => (
              <motion.span
                key={i}
                className="absolute h-3 w-3 rounded-full"
                style={{ background: i % 3 === 0 ? "#fff8e8" : "#b4564b", boxShadow: "0 0 18px rgba(255,248,232,0.75)" }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                whileInView={{ opacity: 1, x: p.x * 7, y: p.y * 7, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: p.delay, ease: EASE }}
                animate={active ? { scale: [1, 1.35, 1], opacity: [0.72, 1, 0.72] } : { scale: 1 }}
              />
            ))}
          </div>
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(145deg,#f8e7b7,#b98d3d)", boxShadow: "0 22px 55px rgba(91,55,15,0.34)" }}
            animate={active ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : { scale: 1 }}
            transition={{ duration: 3.2, repeat: active ? Infinity : 0, ease: "easeInOut" }}
          >
            <span className="text-5xl" style={{ ...scriptFont, color: "#fff8e8" }}>?</span>
          </motion.div>
        </div>
      )}

      {!isInterview && !isFriends && !isQuestion && (
        <div className="relative h-full w-full">
          <motion.div className="absolute left-1/2 top-[34%] h-32 w-32 -translate-x-[68%] rounded-full" style={{ border: "10px solid rgba(255,248,232,0.92)", boxShadow: "0 18px 48px rgba(78,48,14,0.22)" }} animate={active ? { rotate: [0, 10, 0], scale: [1, 1.04, 1] } : { rotate: 0 }} transition={{ duration: 4.2, repeat: active ? Infinity : 0, ease: "easeInOut" }} />
          <motion.div className="absolute left-1/2 top-[34%] h-32 w-32 -translate-x-[18%] rounded-full" style={{ border: "10px solid rgba(200,162,92,0.92)", boxShadow: "0 18px 48px rgba(78,48,14,0.22)" }} animate={active ? { rotate: [0, -10, 0], scale: [1, 1.04, 1] } : { rotate: 0 }} transition={{ duration: 4.2, repeat: active ? Infinity : 0, ease: "easeInOut" }} />
          <motion.div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 text-center" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}>
            <p className="text-6xl leading-none" style={{ ...scriptFont, color: "#fff8e8", textShadow: "0 8px 28px rgba(60,35,10,0.25)" }}>{site.initials[0]}&amp;{site.initials[1]}</p>
            <p className="mt-4 text-[10px] uppercase" style={{ ...sans, letterSpacing: "0.42em", color: "#fff8e8" }}>15 August 2026</p>
          </motion.div>
        </div>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-2xl" style={{ boxShadow: "inset 0 0 0 1px rgba(143,115,64,0.25)" }} />
    </motion.div>
  );
}

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
                <StoryVisual chapter={c} />
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
          <div className="mb-7">
            <StoryVisual chapter={c} active={!reduced} />
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
