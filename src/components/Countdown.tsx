"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  const [t, setT] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6">
      {units.map((u, i) => (
        <motion.div
          key={u.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="card-glass rounded-2xl px-4 py-4 md:px-7 md:py-6 min-w-[68px] md:min-w-[110px] text-center"
        >
          <div className="font-display text-3xl md:text-6xl text-gold-gradient tabular-nums">
            {mounted ? String(u.value).padStart(2, "0") : "--"}
          </div>
          <div className="uppercase tracking-[0.25em] text-[10px] md:text-xs text-ivory/60 mt-2">
            {u.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
