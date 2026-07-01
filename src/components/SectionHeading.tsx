"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  chapter,
  title,
  subtitle,
}: {
  chapter?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12 md:mb-16">
      {chapter && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.4em] text-xs md:text-sm text-gold mb-4"
        >
          {chapter}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="font-display text-4xl md:text-6xl text-gold-gradient leading-tight"
      >
        {title}
      </motion.h2>
      <div className="gold-divider my-6">
        <span className="text-gold text-lg">&#10022;</span>
      </div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="max-w-xl mx-auto text-ivory/70 font-light"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
