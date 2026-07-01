"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import GoldParticles from "@/components/GoldParticles";
import SplashScreen from "@/components/SplashScreen";
import MusicToggle from "@/components/MusicToggle";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Story from "@/components/chapters/Story";
import Invited from "@/components/chapters/Invited";
import Venue from "@/components/chapters/Venue";
import Celebration from "@/components/chapters/Celebration";
import Rsvp from "@/components/chapters/Rsvp";
import Quiz from "@/components/chapters/Quiz";
import Guestbook from "@/components/chapters/Guestbook";
import Gallery from "@/components/chapters/Gallery";
import FaqPlaylist from "@/components/chapters/FaqPlaylist";

export default function Experience() {
  const params = useSearchParams();
  const rawName = params.get("to");
  const guestName = rawName
    ? rawName.charAt(0).toUpperCase() + rawName.slice(1)
    : null;

  const [entered, setEntered] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

  useEffect(() => {
    document.body.style.overflow = entered ? "auto" : "hidden";
  }, [entered]);

  const enter = () => {
    setEntered(true);
    setStartMusic(true);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative">
      <GoldParticles />
      <SplashScreen visible={!entered} onEnter={enter} guestName={guestName} />

      {entered && (
        <>
          <MusicToggle autoPlay={startMusic} />
          <Navigation />
          <main className="relative z-10">
            <Story />
            <Invited guestName={guestName} />
            <Venue />
            <Celebration />
            <Rsvp guestName={guestName} />
            <Quiz />
            <Guestbook />
            <Gallery />
            <FaqPlaylist />
            <Footer />
          </main>
        </>
      )}
    </div>
  );
}
