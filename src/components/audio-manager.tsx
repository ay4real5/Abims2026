"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type SoundName = "seal-pop" | "paper-unfold" | "chime" | "celebration";

type AudioManagerContextType = {
  playSound: (sound: SoundName, volume?: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const AudioManagerContext = createContext<AudioManagerContextType>({
  playSound: () => {},
  isMuted: false,
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioManagerContext);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

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

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  return (
    <AudioManagerContext.Provider value={{ playSound, isMuted, toggleMute }}>
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
