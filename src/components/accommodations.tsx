"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { accommodations } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer, staggerContainerFast } from "@/lib/motion-variants";

export default function Accommodations() {
  return (
    <section
      id="accommodations"
      className="py-20 md:py-32 px-6"
      style={{ background: "var(--cream-light)" }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-gold text-xs md:text-sm">
            Stay With Us
          </p>
          <h2 className="font-script text-burgundy text-4xl md:text-5xl mt-2">
            Accommodations
          </h2>
          <div className="section-divider mt-4" aria-hidden>
            <span className="text-gold text-sm">✦</span>
          </div>
          <p className="text-text-secondary text-sm mt-4 max-w-md mx-auto">
            We&apos;ve arranged special rates at these nearby hotels. Mention our wedding when booking.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerFast}
          className="grid md:grid-cols-3 gap-6"
        >
          {accommodations.map((hotel) => (
            <motion.div
              key={hotel.name}
              variants={fadeInUp}
              className="card-soft overflow-hidden flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ background: "rgba(123,45,59,0.85)" }}>
                  {hotel.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
                  ))}
                </div>
                <h3 className="text-burgundy font-medium text-base">{hotel.name}</h3>
                <p className="text-text-muted text-xs mt-1">{hotel.distance}</p>
                <p className="text-text-secondary text-sm mt-2 flex-1">{hotel.description}</p>
                <a
                  href={hotel.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold hover:text-gold-dark text-sm mt-4 transition"
                >
                  Book Now
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
