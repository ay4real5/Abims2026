"use client";

import { motion } from "framer-motion";
import { Heart, Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { timeline, images } from "@/lib/config";

export default function Story() {
  return (
    <ImmersiveSection id="story" image={images.story}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          chapter="Chapter One"
          title="Our Story"
          subtitle="Every love story is beautiful, but ours is our favourite. Here's how forever began."
        />

        {/* Voice note placeholder cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-20">
          {["Oyebimpe", "Ayorinde"].map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-glass rounded-2xl p-6 flex items-center gap-4"
            >
              <button className="grid place-items-center h-12 w-12 rounded-full bg-gold/15 text-gold shrink-0">
                <Quote className="h-5 w-5" />
              </button>
              <div className="text-left">
                <p className="text-gold text-sm uppercase tracking-widest">
                  A note from {name}
                </p>
                <p className="text-ivory/60 text-sm mt-1">
                  Voice message coming soon — tap to listen.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Memory timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent" />
          <div className="space-y-12">
            {timeline.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-center md:justify-${
                    left ? "start" : "end"
                  } pl-12 md:pl-0`}
                >
                  <div
                    className={`md:w-1/2 ${
                      left ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"
                    }`}
                  >
                    <div className="card-glass rounded-2xl p-6">
                      <span className="font-display text-3xl text-gold-gradient">
                        {item.year}
                      </span>
                      <h3 className="text-xl text-ivory mt-1">{item.title}</h3>
                      <p className="text-ivory/60 text-sm mt-2">{item.text}</p>
                    </div>
                  </div>
                  <span className="absolute left-4 md:left-1/2 -translate-x-1/2 grid place-items-center h-8 w-8 rounded-full bg-ink border border-gold/60 text-gold">
                    <Heart className="h-4 w-4 fill-gold/40" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Photo grid placeholders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-20">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="aspect-[3/4] rounded-xl overflow-hidden border border-gold/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.storyGrid[i % images.storyGrid.length]}
                alt={`Memory ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </ImmersiveSection>
  );
}
