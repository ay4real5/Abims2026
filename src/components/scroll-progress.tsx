"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A slim champagne-gold progress bar fixed to the top of the viewport,
 * reflecting how far the guest has scrolled through the invitation.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[75] h-[3px] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #A8863F, #E6CE88, #C9A85C)",
        boxShadow: "0 1px 6px rgba(201,168,92,0.6)",
      }}
    />
  );
}
