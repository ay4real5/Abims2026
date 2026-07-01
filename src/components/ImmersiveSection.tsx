"use client";

import { ReactNode } from "react";

// Full-bleed cinematic section: a fixed/parallax background photo with a
// readability scrim and overlaid content.
export default function ImmersiveSection({
  id,
  image,
  children,
  align = "center",
  scrim = "heavy",
  minScreen = true,
  className = "",
}: {
  id?: string;
  image: string;
  children: ReactNode;
  align?: "center" | "start" | "end";
  scrim?: "light" | "heavy";
  minScreen?: boolean;
  className?: string;
}) {
  const justify =
    align === "center"
      ? "justify-center"
      : align === "start"
      ? "justify-start"
      : "justify-end";

  const scrimClass =
    scrim === "heavy"
      ? "bg-gradient-to-b from-ink/85 via-ink/70 to-ink/90"
      : "bg-gradient-to-b from-ink/55 via-ink/45 to-ink/75";

  return (
    <section
      id={id}
      className={`relative flex flex-col ${justify} items-center overflow-hidden px-6 py-24 md:py-32 ${
        minScreen ? "min-h-screen" : ""
      } ${className}`}
    >
      {/* Background image with subtle slow zoom */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: `url(${image})`,
          animation: "kenburns 26s ease-in-out infinite alternate",
        }}
      />
      <div aria-hidden className={`absolute inset-0 ${scrimClass}`} />
      {/* Soft gold vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 45%, rgba(12,10,7,0.65) 100%)",
        }}
      />

      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
