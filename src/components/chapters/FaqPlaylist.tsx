"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ListMusic } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ImmersiveSection from "@/components/ImmersiveSection";
import { faqs, wedding, images } from "@/lib/config";

export default function FaqPlaylist() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ImmersiveSection id="faq" image={images.faq}>
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          chapter="Good to Know"
          title="Questions & Playlist"
          subtitle="Everything you need — and the soundtrack to our celebration."
        />

        <div className="space-y-3 mb-16">
          {faqs.map((f, i) => (
            <div key={f.q} className="card-glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-ivory font-medium">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-gold transition-transform shrink-0 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-ivory/65 text-sm">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gold mb-4">
            <ListMusic className="h-5 w-5" />
            <span className="uppercase tracking-[0.3em] text-sm">Our Playlist</span>
          </div>
          <div className="rounded-2xl overflow-hidden card-glass p-2">
            <iframe
              title="Wedding Playlist"
              src={`https://open.spotify.com/embed/playlist/${wedding.spotifyPlaylistId}?theme=0`}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </ImmersiveSection>
  );
}
