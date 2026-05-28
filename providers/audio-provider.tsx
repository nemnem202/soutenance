import { logger } from "@/lib/logger";
import SoundEngine from "@/midi-editor/engines/sound/sound-engine";
import { createContext, useState, type ReactNode } from "react";

interface AudioContextType {
  unlockAudioContext: () => Promise<void>;
  audioLoaded: boolean;
}

export const AudioContext = createContext<AudioContextType | null>(null);

export default function AudioProvider({ children }: { children: ReactNode }) {
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const unlockAudioContext = async () => {
    if (SoundEngine.get() || isInitializing) return;

    setIsInitializing(true);
    try {
      await SoundEngine.initAudio();
      setAudioLoaded(true);
      logger.success("Audio context initialized !");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <AudioContext.Provider value={{ unlockAudioContext, audioLoaded }}>
      <div onClickCapture={unlockAudioContext}>{children}</div>
    </AudioContext.Provider>
  );
}
