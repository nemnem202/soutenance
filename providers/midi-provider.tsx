import { logger } from "@/lib/logger";
import { MidiInstrumentNumber } from "@/midi-editor/types/instruments";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type MidiInput = {
  title: string;
  id: string;
  enlabed: boolean;
};

type MidiContextType = {
  midiEnlabed: boolean;
  setMidiEnlabed: Dispatch<SetStateAction<boolean>>;
  midiInputs: MidiInput[];
  updateMidiInputs: Dispatch<SetStateAction<MidiInput[]>>;
  outputInstrument: MidiInstrumentNumber | null;
  setOutputInstrument: Dispatch<SetStateAction<MidiInstrumentNumber | null>>;
};

export const MidiContext = createContext<MidiContextType | null>(null);

export default function MidiProvider({ children }: { children: ReactNode }) {
  const [midiEnlabed, setMidiEnlabed] = useState<boolean>(false);
  const [midiInputs, updateMidiInputs] = useState<MidiInput[]>([]);
  const [outputInstrument, setOutputInstrument] = useState<MidiInstrumentNumber | null>(null);

  const enlabeMidi = () => {
    logger.info("Enlabe midi");
  };
  const disableMidi = () => {
    logger.info("Disable midi");
  };

  useEffect(() => {
    if (midiEnlabed) {
      enlabeMidi();
    } else {
      disableMidi();
    }
    return () => {
      if (midiEnlabed) disableMidi();
    };
  }, [midiEnlabed]);

  return (
    <MidiContext.Provider
      value={{
        midiEnlabed,
        midiInputs,
        outputInstrument,
        setMidiEnlabed,
        updateMidiInputs,
        setOutputInstrument,
      }}
    >
      {children}
    </MidiContext.Provider>
  );
}

export function useMidi(): MidiContextType {
  const context = useContext(MidiContext);
  if (!context) throw new Error("Midi context must be used within its provider !");
  return context;
}
