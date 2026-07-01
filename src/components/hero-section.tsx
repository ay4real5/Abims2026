"use client";

import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { weddingData } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import { useGuestName } from "@/lib/use-guest-name";
import { downloadWeddingICS } from "@/lib/calendar";
import CountdownTimer from "@/components/countdown-timer";

export default function HeroSection() {
  const { couple, date, venues } = weddingData;
  const guestName = useGuestName();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FFFDF7 0%, #FAF6EC 50%, #F2EAD6 100%)",
      }}
    >
      {/* Decorative top border */}
      <motion.div
        variants={fadeInUp}
        className="section-divider mb-8"
        aria-hidden
      >
        <span className="text-gold text-lg">❦</span>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center text-center max-w-2xl"
      >
        {guestName && (
          <motion.p
            variants={fadeInUp}
            className="font-script text-gold-dark text-2xl md:text-3xl mb-1"
          >
            Welcome, {guestName}
          </motion.p>
        )}

        <motion.p
          variants={fadeInUp}
          className="uppercase tracking-[0.4em] text-gold-dark text-[11px] md:text-sm font-medium"
        >
          We&apos;re Getting Married
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="font-script text-gold-foil display-fluid mt-4"
        >
          {couple.bride}
          <span className="text-gold px-3">&</span>
          {couple.groom}
        </motion.h1>

        <motion.div
          variants={fadeInUp}
          className="section-divider my-6"
          aria-hidden
        >
          <span className="text-gold text-sm">✦</span>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="font-serif-text text-text-secondary text-lg md:text-xl italic"
        >
          {date.display}
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="text-text-muted text-sm md:text-base mt-2"
        >
          {venues.ceremony.name} · {venues.reception.name}
        </motion.p>

        {/* Countdown */}
        <motion.div variants={fadeInUp} className="mt-10">
          <CountdownTimer targetDate={date.ceremony} />
        </motion.div>

        {/* Add to Calendar */}
        <motion.button
          variants={fadeInUp}
          onClick={downloadWeddingICS}
          className="btn-gold inline-flex items-center gap-2 mt-8"
        >
          <CalendarPlus className="w-4 h-4" />
          Add to Calendar
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <span className="text-text-muted text-xs uppercase tracking-widest">
            Scroll to explore
          </span>
          <div
            className="w-px h-12 bg-gradient-to-b from-gold to-transparent"
            style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
