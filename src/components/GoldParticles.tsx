"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: string;
  opacity: number;
};

// Floating gold dust particles rendered behind content.
// Generated only on the client (after mount) to avoid SSR hydration mismatch
// caused by Math.random() differing between server and client.
export default function GoldParticles({ count = 36 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 3,
        duration: 12 + Math.random() * 18,
        delay: -Math.random() * 20,
        drift: `${(Math.random() - 0.5) * 120}px`,
        opacity: 0.3 + Math.random() * 0.5,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-10px] rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, #e7c477, #c9a253)",
            boxShadow: "0 0 6px rgba(231,196,119,0.8)",
            opacity: p.opacity,
            // @ts-expect-error custom property
            "--drift": p.drift,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
