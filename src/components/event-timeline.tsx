"use client";

import { motion } from "framer-motion";
import { timeline } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer } from "@/lib/motion-variants";

const iconMap: Record<string, string> = {
  church: "M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6",
  glass: "M8 3h8l-1 8a3 3 0 01-6 0L8 3zM12 11v7M8 21h8",
  dance: "M9 11a2 2 0 100-4 2 2 0 000 4zM9 11v3l-2 5m4-8l3 3v4m-5-7l-2 4m8-1a2 2 0 100-4 2 2 0 000 4z",
  music: "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z",
};

export default function EventTimeline() {
  return (
    <section
      id="timeline"
      className="py-20 md:py-32 px-6"
      style={{ background: "var(--cream-light)" }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-gold text-xs md:text-sm">
            The Plan
          </p>
          <h2 className="font-script text-burgundy text-4xl md:text-5xl mt-2">
            Wedding Day Schedule
          </h2>
          <div className="section-divider mt-4" aria-hidden>
            <span className="text-gold text-sm">✦</span>
          </div>
        </motion.div>

        {timeline.map((day) => (
          <div key={day.day}>
            <motion.h3
              variants={fadeInUp}
              className="text-center text-burgundy font-medium text-lg mb-8"
            >
              {day.day}
              {day.isWeddingDay && (
                <span className="ml-2 text-gold text-sm">★</span>
              )}
            </motion.h3>

            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
                style={{ background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }}
              />

              {day.events.map((event, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className={`relative flex items-center mb-8 ${
                    idx % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Time */}
                  <div className="w-1/2 px-4 md:px-8 text-right">
                    {idx % 2 === 0 && (
                      <>
                        <p className="text-burgundy font-medium text-lg">{event.time}</p>
                        <p className="text-text-secondary text-sm">{event.title}</p>
                      </>
                    )}
                  </div>

                  {/* Center dot with icon */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-full"
                      style={{
                        background: "var(--cream-lightest)",
                        border: "2px solid var(--gold)",
                        boxShadow: "0 2px 8px rgba(196,163,90,0.2)",
                      }}
                    >
                      <svg className="w-5 h-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[event.icon] || iconMap.church} />
                      </svg>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="w-1/2 px-4 md:px-8">
                    {idx % 2 !== 0 && (
                      <>
                        <p className="text-burgundy font-medium text-lg">{event.time}</p>
                        <p className="text-text-secondary text-sm">{event.title}</p>
                      </>
                    )}
                    {idx % 2 === 0 ? (
                      <div className="text-left">
                        <p className="text-text-muted text-xs">{event.location}</p>
                        {"description" in event && event.description && (
                          <p className="text-text-muted text-xs mt-1">{event.description}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-text-muted text-xs">{event.location}</p>
                        {"description" in event && event.description && (
                          <p className="text-text-muted text-xs mt-1">{event.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
