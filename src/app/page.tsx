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
      <main
        className="flex flex-col"
        style={{
          margin: 0,
          padding: 0,
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            height: "100dvh",
            minHeight: "100dvh",
            maxHeight: "100dvh",
            margin: 0,
            padding: 0,
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
          }}
        >
          <EnvelopeIntro onOpen={handleEnvelopeOpen} />
        </div>

        {/* Main content — revealed after envelope opens */}
        <div
          style={{
            display: envelopeOpen ? "block" : "none",
            opacity: envelopeOpen ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
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
        </div>
      </main>
    </AudioProvider>
  );
}
