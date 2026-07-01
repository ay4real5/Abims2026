"use client";

import { useState, useCallback } from "react";
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

  return (
    <AudioProvider>
      {envelopeOpen && <ScrollProgress />}
      <main className="flex flex-col">
        {/* Envelope intro — always in DOM for scroll-back refold */}
        <div
          style={{
            minHeight: "100vh",
            overflow: "visible",
          }}
        >
          <EnvelopeIntro onOpen={handleEnvelopeOpen} />
        </div>

        {/* Main content — revealed after envelope opens */}
        <div
          style={{
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
