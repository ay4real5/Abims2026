"use client";

import { motion, AnimatePresence } from "framer-motion";
import { wedding, images } from "@/lib/config";

export default function SplashScreen({
  visible,
  onEnter,
  guestName,
}: {
  visible: boolean;
  onEnter: () => void;
  guestName?: string | null;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        >
          {/* Cinematic hero background */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${images.hero})`,
              animation: "kenburns 30s ease-in-out infinite alternate",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/65 to-ink/95"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(12,10,7,0.8) 100%)",
            }}
          />
          {/* Decorative ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute h-[320px] w-[320px] md:h-[520px] md:w-[520px] rounded-full border border-gold/20"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
            className="absolute h-[220px] w-[220px] md:h-[380px] md:w-[380px] rounded-full border border-gold/30"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="uppercase tracking-[0.5em] text-xs md:text-sm text-gold mb-6"
          >
            {guestName ? `Welcome, ${guestName}` : "Our story begins"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="font-display text-5xl md:text-8xl text-gold-gradient glow leading-tight"
          >
            {wedding.bride}
            <span className="block text-2xl md:text-4xl text-ivory/80 my-2 md:my-3">
              &amp;
            </span>
            {wedding.groom}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="mt-6 text-ivory/70 tracking-widest text-sm md:text-base"
          >
            {wedding.dateLabel}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnter}
            className="relative mt-12 px-10 py-4 rounded-full border border-gold/50 text-gold uppercase tracking-[0.3em] text-xs md:text-sm overflow-hidden"
          >
            <span className="relative z-10">Tap to Enter</span>
            <span className="absolute inset-0 shimmer opacity-40" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2.6, duration: 1 }}
            className="mt-8 text-ivory/40 text-xs"
          >
            ♪ Best experienced with sound on
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
