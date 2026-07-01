"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { weddingData } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from "@/lib/motion-variants";

export default function CeremonyReception() {
  const { venues } = weddingData;

  return (
    <section
      id="details"
      className="py-20 md:py-32 px-6"
      style={{ background: "var(--cream-lightest)" }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-gold text-xs md:text-sm">
            The Details
          </p>
          <h2 className="font-script text-burgundy text-4xl md:text-5xl mt-2">
            Where &amp; When
          </h2>
          <div className="section-divider mt-4" aria-hidden>
            <span className="text-gold text-sm">✦</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Ceremony */}
          <motion.div variants={slideInLeft} className="card-soft p-8 md:p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blush-light mb-4">
                <svg className="w-7 h-7 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M9 11h.01M15 11h.01" />
                </svg>
              </div>
              <h3 className="font-script text-burgundy text-3xl">Ceremony</h3>
              <div className="section-divider my-4" aria-hidden>
                <span className="text-gold text-xs">✦</span>
              </div>
              <p className="text-text-primary font-medium text-lg">{venues.ceremony.name}</p>
              <p className="text-text-secondary text-sm mt-1">{venues.ceremony.address}</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-burgundy">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{venues.ceremony.time}</span>
              </div>
              <a
                href={venues.ceremony.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark text-sm transition"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

          {/* Reception */}
          <motion.div variants={slideInRight} className="card-soft p-8 md:p-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blush-light mb-4">
                <svg className="w-7 h-7 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v10a2 2 0 002 2h10a2 2 0 002-2V3M5 3h14M5 3l-2 4h18l-2-4M9 15v6m6-6v6M3 21h18" />
                </svg>
              </div>
              <h3 className="font-script text-burgundy text-3xl">Reception</h3>
              <div className="section-divider my-4" aria-hidden>
                <span className="text-gold text-xs">✦</span>
              </div>
              <p className="text-text-primary font-medium text-lg">{venues.reception.name}</p>
              <p className="text-text-secondary text-sm mt-1">{venues.reception.address}</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-burgundy">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{venues.reception.time}</span>
              </div>
              <a
                href={venues.reception.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-gold hover:text-gold-dark text-sm transition"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Embedded map */}
        <motion.div
          variants={fadeInUp}
          className="mt-8 rounded-lg overflow-hidden shadow-md"
          style={{ border: "1px solid var(--cream-dark)" }}
        >
          <iframe
            title="Wedding Venues Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(venues.ceremony.mapsEmbedQuery)}&output=embed`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
