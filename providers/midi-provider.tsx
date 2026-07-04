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
  outputInstrument: MidiInstrumentNumber;
  setOutputInstrument: Dispatch<SetStateAction<MidiInstrumentNumber>>;
  onMidiMessage: (callback: MidiCallback) => void;
};

export const MidiContext = createContext<MidiContextType | null>(null);

export default function MidiProvider({ children }: { children: ReactNode }) {
  const [midiEnabled, setMidiEnabled] = useState<boolean>(false);
  const [midiInputs, updateMidiInputs] = useState<MidiInput[]>([]);
  const [outputInstrument, setOutputInstrument] = useState<MidiInstrumentNumber>(
    MidiInstrumentNumber.BrightAcousticPiano
  );
  const inputsRef = useRef<MidiInput[]>([]);

  const noteOn = (note: number, velocity: number) => {
    SoundEngine.noteOn(note, velocity);
  };

  const noteOff = (note: number) => {
    SoundEngine.noteOff(note);
  };

  const callbackRef = useRef<MidiCallback | null>((event) => {
    if (!event.data) return;
    const command = event.data[0];
    const note = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 0;

    switch (command) {
      case 144:
        if (velocity > 0) {
          noteOn(note, velocity);
        } else {
          noteOff(note);
        }
        break;
      case 128:
        noteOff(note);
        break;
    }
  });

  const onMidiMessage = (callback: MidiCallback) => {
    callbackRef.current = callback;
  };

  const handleMidiEvent = (event: MIDIMessageEvent) => {
    const input = event.target as MIDIInput;

    const inputState = inputsRef.current.find((i) => i.id === input.id);

    if (!inputState || !inputState.enabled) return;

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
      } catch (err) {
        logger.error("MIDI access denied", err);
      }
    };

    if (midiEnabled) {
      setupMidi();
    }

    return () => {
      midiAccess?.inputs.forEach((input) => (input.onmidimessage = null));
    };
  }, [midiEnabled]);

  useEffect(() => {
    if (outputInstrument) SoundEngine.changeUserInstrument(outputInstrument);
  }, [outputInstrument]);

  useEffect(() => {
    inputsRef.current = midiInputs;
  }, [midiInputs]);

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
