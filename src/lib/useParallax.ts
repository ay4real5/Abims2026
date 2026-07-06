"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

/**
 * Tracks pointer position (desktop) and device tilt (mobile) as a smoothed
 * -1…1 vector. Layers multiply it by a depth factor to drift at different
 * rates — giving the interior a sense of real, reach-into-it depth.
 */
export function useParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 40, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 40, damping: 18, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      x.set(Math.max(-1, Math.min(1, e.gamma / 30)));
      y.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, [x, y]);

  return { x: sx, y: sy };
}
