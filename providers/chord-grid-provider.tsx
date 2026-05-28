import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from "react";

const ChordGridContext = createContext<{
  primedMeasure: number | null;
  setPrimedMeasure: (index: number | null) => void;
} | null>(null);

export default function ChordGridProvider({ children }: { children: ReactNode }) {
  const state = useMidiStore().state!;
  const [primedMeasure, setPrimedMeasure] = useState<number | null>(null);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    if (state?.transport.status === "playing") {
      setPrimedMeasure(null);
    }
  }, [state?.transport.status]);

  return (
    <ChordGridContext.Provider
      value={{
        primedMeasure,
        setPrimedMeasure,
      }}
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
