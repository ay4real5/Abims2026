"use client";

import { Heart } from "lucide-react";
import { wedding, images } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative py-24 px-6 text-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${images.footer})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-ink/85" />
      <div className="relative z-10">
      <div className="gold-divider mb-6">
        <Heart className="h-5 w-5 text-gold fill-gold/30" />
      </div>
      <h3 className="font-display text-4xl md:text-5xl text-gold-gradient">
        {wedding.bride} &amp; {wedding.groom}
      </h3>
      <p className="text-ivory/60 mt-3 tracking-widest">{wedding.dateLabel}</p>
      <p className="text-gold mt-2">{wedding.hashtag}</p>
      <p className="text-ivory/30 text-xs mt-8">
        Made with love · An experience, not an invitation
      </p>
      </div>
    </footer>
  );
}
