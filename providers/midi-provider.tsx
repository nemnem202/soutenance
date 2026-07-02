import { logger } from "@/lib/logger";
import SoundEngine from "@/midi-editor/engines/sound/sound-engine";
import { MidiInstrumentNumber } from "@/midi-editor/types/instruments";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type MidiInput = {
  title: string;
  id: string;
  enabled: boolean;
};

type MidiCallback = (event: MIDIMessageEvent) => void;

type MidiContextType = {
  midiEnabled: boolean;
  setMidiEnabled: Dispatch<SetStateAction<boolean>>;
  midiInputs: MidiInput[];
  updateMidiInputs: Dispatch<SetStateAction<MidiInput[]>>;
  outputInstrument: MidiInstrumentNumber | null;
  setOutputInstrument: Dispatch<SetStateAction<MidiInstrumentNumber | null>>;
  // Permet aux composants de s'abonner à des messages
  onMidiMessage: (callback: MidiCallback) => void;
};

export const MidiContext = createContext<MidiContextType | null>(null);

export default function MidiProvider({ children }: { children: ReactNode }) {
  const [midiEnabled, setMidiEnabled] = useState<boolean>(false);
  const [midiInputs, updateMidiInputs] = useState<MidiInput[]>([]);
  const [outputInstrument, setOutputInstrument] = useState<MidiInstrumentNumber | null>(null);

  const noteOn = (note: number, velocity: number) => {
    SoundEngine.noteOn(note, velocity);
  };

  const noteOff = (note: number) => {
    SoundEngine.noteOff(note);
  };

  // Utilisation d'un ref pour stocker le callback afin d'éviter de redéclencher les effets
  const callbackRef = useRef<MidiCallback | null>((event) => {
    if (!event.data) return;
    const command = event.data[0];
    const note = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 0;

    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          noteOn(note, velocity);
        } else {
          noteOff(note);
        }
        break;
      case 128: // noteOff
        noteOff(note);
        break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  });

  const onMidiMessage = (callback: MidiCallback) => {
    callbackRef.current = callback;
  };

  const handleMidiEvent = (event: MIDIMessageEvent) => {
    if (callbackRef.current) {
      callbackRef.current(event);
    }
  };

  useEffect(() => {
    let midiAccess: MIDIAccess | null = null;

    const setupMidi = async () => {
      try {
        const access = await navigator.requestMIDIAccess();
        midiAccess = access;

        const inputs: MidiInput[] = Array.from(access.inputs.values()).map((input) => {
          input.onmidimessage = handleMidiEvent;
          return { title: input.name || "Unknown", id: input.id, enabled: true };
        });

        updateMidiInputs(inputs);
        logger.info("MIDI initialized");
      } catch (err) {
        logger.error("MIDI access denied", err);
      }
    };

    if (midiEnabled) {
      setupMidi();
    }

    return () => {
      // Nettoyage : retirer les écouteurs si nécessaire
      midiAccess?.inputs.forEach((input) => (input.onmidimessage = null));
    };
  }, [midiEnabled]);

  return (
    <MidiContext.Provider
      value={{
        midiEnabled,
        setMidiEnabled,
        midiInputs,
        updateMidiInputs,
        outputInstrument,
        setOutputInstrument,
        onMidiMessage,
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
