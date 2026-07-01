"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-20 md:py-32 px-6"
      style={{ background: "var(--cream-lightest)" }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-gold text-xs md:text-sm">
            Good To Know
          </p>
          <h2 className="font-script text-burgundy text-4xl md:text-5xl mt-2">
            FAQs
          </h2>
          <div className="section-divider mt-4" aria-hidden>
            <span className="text-gold text-sm">✦</span>
          </div>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="card-soft overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                aria-expanded={openIdx === idx}
              >
                <span className="text-burgundy font-medium text-sm md:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gold flex-shrink-0 ml-2 transition-transform ${
                    openIdx === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-text-secondary text-sm">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
