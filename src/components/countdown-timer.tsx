"use client";

import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(target: string): TimeLeft {
  const difference = +new Date(target) - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-6">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center"
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: "clamp(60px, 18vw, 90px)",
              height: "clamp(60px, 18vw, 90px)",
              background: "linear-gradient(145deg, #FFFFFF, #F5F0E8)",
              boxShadow: "0 4px 16px rgba(61, 48, 40, 0.12)",
              border: "1px solid #E8D5C8",
            }}
          >
            <span className="text-burgundy text-2xl md:text-4xl font-light tabular-nums">
              {mounted ? String(unit.value).padStart(2, "0") : "--"}
            </span>
          </div>
          <span className="text-text-muted text-xs md:text-sm mt-2 uppercase tracking-wider">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
