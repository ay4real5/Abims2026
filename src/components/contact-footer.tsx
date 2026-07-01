"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { weddingData } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";

export default function ContactFooter() {
  const { couple, contact, date, url } = weddingData;
  const shareText = `You're invited to ${couple.shortNames}'s wedding on ${date.display}! ${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <>
      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 md:py-32 px-6"
        style={{ background: "var(--cream-light)" }}
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <p className="uppercase tracking-[0.3em] text-gold text-xs md:text-sm">
              Get In Touch
            </p>
            <h2 className="font-script text-burgundy text-4xl md:text-5xl mt-2">
              Questions?
            </h2>
            <div className="section-divider mt-4" aria-hidden>
              <span className="text-gold text-sm">✦</span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 mt-8">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-burgundy transition"
            >
              <Mail className="w-5 h-5 text-gold" />
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-burgundy transition"
            >
              <Phone className="w-5 h-5 text-gold" />
              {contact.phone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-burgundy inline-flex items-center gap-2 mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              Share on WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="py-16 px-6 text-center"
        style={{ background: "var(--burgundy-darker)" }}
      >
        <div className="section-divider mb-6" aria-hidden>
          <span className="text-gold text-sm">❦</span>
        </div>
        <h3 className="font-script text-gold text-3xl md:text-4xl">
          {couple.shortNames}
        </h3>
        <p className="text-cream-light/60 text-sm mt-2 tracking-widest">
          {date.display}
        </p>
        <p className="text-gold/80 text-xs mt-3">
          {couple.monogram} · Forever Begins
        </p>
        <p className="text-cream-light/30 text-xs mt-8">
          Made with love · An experience, not an invitation
        </p>
      </footer>
    </>
  );
}
