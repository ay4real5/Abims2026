"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { weddingData } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";
import RsvpModal from "@/components/rsvp-modal";

export default function RsvpSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <section
      id="rsvp"
      className="py-20 md:py-32 px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, var(--burgundy-dark) 0%, var(--burgundy-darker) 100%)" }}
    >
      {/* Decorative sparkles */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute text-gold/20"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 22}%`,
              fontSize: "10px",
              animation: `sparkleOrbit ${10 + i}s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        <motion.p
          variants={fadeInUp}
          className="uppercase tracking-[0.3em] text-gold text-xs md:text-sm"
        >
          Be Part Of Our Story
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="font-script text-cream-light text-4xl md:text-6xl mt-2"
        >
          Will You Join Us?
        </motion.h2>
        <motion.div variants={fadeInUp} className="section-divider mt-4" aria-hidden>
          <span className="text-gold text-sm">✦</span>
        </motion.div>
        <motion.p
          variants={fadeInUp}
          className="text-cream-light/70 text-sm md:text-base mt-6 max-w-md mx-auto"
        >
          Please RSVP by July 15, 2026 so we can prepare for your celebration.
        </motion.p>
        <motion.button
          variants={fadeInUp}
          onClick={openModal}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm tracking-wide transition-all hover:scale-105"
          style={{
            background: "var(--gold)",
            color: "var(--white)",
            boxShadow: "0 4px 20px rgba(196,163,90,0.3)",
          }}
        >
          RSVP Now
        </motion.button>
      </motion.div>

      <RsvpModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
