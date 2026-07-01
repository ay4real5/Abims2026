"use client";

import { useState, useCallback, useEffect } from "react";
import { AudioProvider } from "@/components/audio-manager";
import ScrollProgress from "@/components/scroll-progress";
import EnvelopeIntro from "@/components/envelope-intro";
import CeremonyReception from "@/components/ceremony-reception";
import EventTimeline from "@/components/event-timeline";
import PhotoGallery from "@/components/photo-gallery";
import RsvpSection from "@/components/rsvp-section";
import Accommodations from "@/components/accommodations";
import Registry from "@/components/registry";
import FaqSection from "@/components/faq-section";
import ContactFooter from "@/components/contact-footer";

export default function Home() {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  const handleEnvelopeOpen = useCallback(() => {
    setEnvelopeOpen(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = envelopeOpen ? "" : "hidden";
    document.documentElement.style.overflow = envelopeOpen ? "" : "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [envelopeOpen]);

  return (
    <AudioProvider>
      {envelopeOpen && <ScrollProgress />}

      {/* ═══ ENVELOPE SCENE — full viewport, disappears after opening ═══ */}
      <div
        style={{
          position: envelopeOpen ? "absolute" : "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: envelopeOpen ? "0" : "100dvh",
          overflow: "hidden",
          zIndex: envelopeOpen ? 0 : 100,
          transition: "height 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        <EnvelopeIntro onOpen={handleEnvelopeOpen} />
      </div>

      {/* ═══ MAIN CONTENT — scene changes, invitation takes over ═══ */}
      <main
        style={{
          position: "relative",
          opacity: envelopeOpen ? 1 : 0,
          transition: "opacity 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)",
          pointerEvents: envelopeOpen ? "auto" : "none",
        }}
      >
        <CeremonyReception />
        <EventTimeline />
        <PhotoGallery />
        <RsvpSection />
        <Accommodations />
        <Registry />
        <FaqSection />
        <ContactFooter />
      </main>
    </AudioProvider>
  );
}
