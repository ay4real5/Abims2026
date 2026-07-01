"use client";

import { motion } from "framer-motion";
import { registryLinks } from "@/lib/wedding-data";
import { fadeInUp, staggerContainer, staggerContainerFast } from "@/lib/motion-variants";
import { ShoppingBag, Gift, Plane } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "shopping-bag": ShoppingBag,
  "gift": Gift,
  "plane": Plane,
};

export default function Registry() {
  return (
    <section
      id="registry"
      className="py-20 md:py-32 px-6"
      style={{ background: "var(--cream-lightest)" }}
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
            With Gratitude
          </p>
          <h2 className="font-script text-burgundy text-4xl md:text-5xl mt-2">
            Gift Registry
          </h2>
          <div className="section-divider mt-4" aria-hidden>
            <span className="text-gold text-sm">✦</span>
          </div>
          <p className="text-text-secondary text-sm mt-4 max-w-md mx-auto">
            Your presence is the greatest gift. For those who wish, here are a few registries.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainerFast}
          className="grid md:grid-cols-3 gap-6"
        >
          {registryLinks.map((item) => {
            const Icon = iconMap[item.icon] || Gift;
            return (
              <motion.a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                className="card-soft p-6 text-center flex flex-col items-center hover:shadow-lg transition-shadow group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blush-light mb-3 group-hover:bg-burgundy/10 transition-colors">
                  <Icon className="w-6 h-6 text-burgundy" />
                </div>
                <h3 className="text-burgundy font-medium text-base">{item.name}</h3>
                <p className="text-text-muted text-xs mt-1">{item.description}</p>
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
