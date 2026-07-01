"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import Countdown from "@/components/Countdown";
import ImmersiveSection from "@/components/ImmersiveSection";
import { wedding, images } from "@/lib/config";

export default function Invited({ guestName }: { guestName?: string | null }) {
  return (
    <ImmersiveSection id="invited" image={images.invited}>
      <div className="max-w-4xl mx-auto text-center">
        <SectionHeading
          chapter="Chapter Two"
          title="You're Invited"
          subtitle={
            guestName
              ? `${guestName}, we would be honoured by your presence.`
              : "We would be honoured by your presence as we say 'I do'."
          }
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="card-glass rounded-3xl px-8 py-12 md:px-16 md:py-16 mb-14"
        >
          <p className="uppercase tracking-[0.35em] text-gold text-xs md:text-sm">
            Together with their families
          </p>
          <h3 className="font-display text-4xl md:text-7xl text-gold-gradient my-6 leading-tight">
            {wedding.bride} &amp; {wedding.groom}
          </h3>
          <p className="text-ivory/70 max-w-md mx-auto">
            request the pleasure of your company to celebrate their marriage
          </p>
          <div className="gold-divider my-8">
            <span className="text-gold">&#10022;</span>
          </div>
          <p className="font-display text-2xl md:text-3xl text-ivory">
            {wedding.dateLabel}
          </p>
          <p className="text-gold mt-2 tracking-widest">{wedding.hashtag}</p>
        </motion.div>

        <p className="uppercase tracking-[0.35em] text-gold text-xs md:text-sm mb-8">
          Counting down to forever
        </p>
        <Countdown date={wedding.date} />
      </div>
    </ImmersiveSection>
  );
}
