import { logger } from "@/lib/logger";
import SoundEngine from "@/midi-editor/engines/sound-engine";
import { createContext, useState, type ReactNode } from "react";

interface AudioContextType {
  loadMidiFile: () => void;
  isPlaying: () => boolean;
  release: () => void;
  setPlayhead: (tick: number) => void;
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

  const loadMidiFile = () => {
    const engine = SoundEngine.get();
    if (engine) {
      engine.loadNewMidi();
    }
  };
  const release = () => {};
  const setPlayhead = () => {};
  const isPlaying = () => {
    return !!SoundEngine.get()?.isPlaying;
  };

  return (
    <AudioContext.Provider value={{ loadMidiFile, isPlaying, setPlayhead, release, audioLoaded }}>
      <div onClickCapture={unlockAudioContext}>{children}</div>
    </AudioContext.Provider>
  );
}
