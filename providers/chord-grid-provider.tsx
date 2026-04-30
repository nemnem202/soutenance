import SoundEngine from "@/midi-editor/engines/sound-engine";
import { convertSecondsToTick, getCurrentMeasureIndex } from "@/midi-editor/lib/utils";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

const ChordGridContext = createContext<{ currentMeasure: number } | null>(null);

export default function ChordGridProvider({ children }: { children: ReactNode }) {
  const { state } = useMidiStore();
  const requestRef = useRef<number>(null);
  const [currentMeasure, setCurrentMeasure] = useState(0);
  useEffect(() => {
    const loop = () => {
      const soundInstance = SoundEngine.get();
      if (!soundInstance || !state?.transport.isPlaying) {
        return () => {
          requestRef.current && cancelAnimationFrame(requestRef.current);
        };
      }
      const time = convertSecondsToTick(
        soundInstance.currentTime,
        soundInstance.currentTempo,
        state.config.ppq
      );
      const nextMeasure = getCurrentMeasureIndex(state.config.ppq, time);
      setCurrentMeasure(nextMeasure);
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);

    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    };
  }, [state]);

  return (
    <ChordGridContext.Provider value={{ currentMeasure }}>{children}</ChordGridContext.Provider>
  );
}

export function useChordGrid() {
  const context = useContext(ChordGridContext);
  if (!context) throw new Error("Use chord grid must be used within it's provider");
  return context;
}
