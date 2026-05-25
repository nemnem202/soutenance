import useAudio from "@/hooks/use-audio";
import { logger } from "@/lib/logger";
import SoundEngine from "@/midi-editor/engines/sound/sound-engine";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { ExerciseSchema } from "@/types/entities";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

const ChordGridContext = createContext<{
  currentMeasure: number;
  primedMeasure: number | null;
  setPrimedMeasure: (index: number | null) => void;
  setCurrentMeasure: (index: number) => void;
} | null>(null);

export default function ChordGridProvider({ children }: { children: ReactNode }) {
  const state = useMidiStore().state!;
  const [primedMeasure, setPrimedMeasure] = useState<number | null>(null);
  const requestRef = useRef<number>(null);
  const [currentMeasure, setCurrentMeasure] = useState(SoundEngine.get()?.currentMeasure ?? 0);

  useEffect(() => {
    SoundEngine.onMeasureChange = (measure: number) => {
      setCurrentMeasure(measure);
    };
    return () => {
      SoundEngine.onMeasureChange = null;
    };
  });

  useEffect(() => {
    if (state?.transport.status === "playing") {
      setPrimedMeasure(null);
    }
  }, [state?.transport.status]);

  return (
    <ChordGridContext.Provider
      value={{ currentMeasure, primedMeasure, setPrimedMeasure, setCurrentMeasure }}
    >
      {children}
    </ChordGridContext.Provider>
  );
}

export function useChordGrid() {
  const context = useContext(ChordGridContext);
  if (!context) throw new Error("Use chord grid must be used within it's provider");
  return context;
}
