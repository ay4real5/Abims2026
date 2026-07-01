"use client";

import { motion } from "framer-motion";
import { Church, Wine, Utensils, Music2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { schedule, images } from "@/lib/config";

const iconMap: Record<string, typeof Church> = {
  church: Church,
  glass: Wine,
  utensils: Utensils,
  music: Music2,
};

export default function Celebration() {
  return (
    <ImmersiveSection id="celebration" image={images.celebration}>
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          chapter="Chapter Four"
          title="The Celebration"
          subtitle="From the first vow to the last dance — here's how the day will unfold."
        />

        <div className="space-y-5">
          {schedule.map((s, i) => {
            const Icon = iconMap[s.icon] ?? Church;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="card-glass rounded-2xl p-6 flex items-center gap-5 group hover:border-gold/50 transition-colors"
              >
                <div className="grid place-items-center h-14 w-14 rounded-full bg-gold/15 text-gold shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl text-ivory">{s.title}</h3>
                    <span className="text-gold text-sm tracking-widest whitespace-nowrap">
                      {s.time}
                    </span>
                  </div>
                  <p className="text-ivory/60 text-sm mt-1">{s.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ImmersiveSection>
  );
}
