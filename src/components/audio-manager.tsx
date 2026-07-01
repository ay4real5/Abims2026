"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

type SoundName = "seal-pop" | "paper-unfold" | "chime" | "celebration" | "wax-crack" | "music";

type AudioManagerContextType = {
  playSound: (sound: SoundName, volume?: number) => void;
  startMusic: () => void;
  stopMusic: () => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const AudioManagerContext = createContext<AudioManagerContextType>({
  playSound: () => {},
  startMusic: () => {},
  stopMusic: () => {},
  isMuted: false,
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioManagerContext);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(
    (sound: SoundName, volume = 0.5) => {
      if (isMuted) return;
      try {
        const audio = new Audio(`/sounds/${sound}.mp3`);
        audio.volume = volume;
        audio.play().catch(() => {});
      } catch {
        // Silently fail if audio file is missing
      }
    },
    [isMuted]
  );

  const startMusic = useCallback(() => {
    if (isMuted) return;
    try {
      if (!musicRef.current) {
        musicRef.current = new Audio("/sounds/music.mp3");
        musicRef.current.loop = true;
        musicRef.current.volume = 0;
      }
      const m = musicRef.current;
      m.play().catch(() => {});
      // Fade in over 3 seconds
      let vol = 0;
      const target = 0.35;
      const fadeInterval = setInterval(() => {
        vol += 0.02;
        if (vol >= target) {
          m.volume = target;
          clearInterval(fadeInterval);
        } else {
          m.volume = vol;
        }
      }, 60);
    } catch {
      // Silently fail
    }
  }, [isMuted]);

  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      const m = musicRef.current;
      // Fade out over 1.5 seconds
      let vol = m.volume;
      const fadeInterval = setInterval(() => {
        vol -= 0.03;
        if (vol <= 0) {
          m.volume = 0;
          m.pause();
          clearInterval(fadeInterval);
        } else {
          m.volume = vol;
        }
      }, 50);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((m) => {
      const newMuted = !m;
      if (musicRef.current) {
        if (newMuted) {
          musicRef.current.volume = 0;
        } else {
          musicRef.current.volume = 0.35;
        }
      }
      return newMuted;
    });
  }, []);

  return (
    <AudioManagerContext.Provider value={{ playSound, startMusic, stopMusic, isMuted, toggleMute }}>
      {children}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="fixed top-4 right-4 z-[70] p-2.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md transition hover:bg-white"
      >
        {isMuted ? (
          <svg className="h-5 w-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </AudioManagerContext.Provider>
  );
}
