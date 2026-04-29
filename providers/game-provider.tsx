import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useLanguage } from "@/hooks/use-language";
import type { Exercise } from "@/types/entities";
import type { State as MidiState } from "@/midi-editor/types/instance";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/midi-editor/lib/midiconverter";
import onMidiFile from "@/telefunc/midifile.telefunc";
import { errorToast } from "@/lib/toaster";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import type { MidiAction } from "@/midi-editor/types/actions";
import useAudio from "@/hooks/use-audio";
import { useShortcuts } from "@/midi-editor/hooks/useShortcuts";

const tabsIds = ["piano-roll", "chords", "sheet", "guitar"] as const;
export type TabID = (typeof tabsIds)[number];
export type Tab = { id: TabID; label: string; disabled?: boolean };

export interface GameContextType {
  exercise: Exercise;
  tabs: Tab[];
  activeTab: TabID;
  setActiveTab: Dispatch<SetStateAction<TabID>>;
  midiState: MidiState | null;
  midiLoading: boolean;
  dispatch: (action: MidiAction) => void;
}

export const GameContext = createContext<GameContextType | null>(null);

export default function GameProvider({
  exercise,
  children,
}: {
  exercise: Exercise;
  children: ReactNode;
}) {
  const { instance } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabID>("chords");
  const [midiLoading, setMidiLoading] = useState(true);
  const dispatch = useMidiStore((s) => s.dispatch);
  const state = useMidiStore((s) => s.state);
  const { loadMidiFile } = useAudio();

  useShortcuts();
  useEffect(() => {
    let isMounted = true;
    async function loadResources() {
      setMidiLoading(true);
      try {
        const response = await onMidiFile(exercise.id);
        if (response.success && isMounted) {
          const midiFile = await getMidiFileFromBuffer(response.data);
          const newState = await convertMidiFileToState(midiFile);
          useMidiStore.setState({ state: newState });
          loadMidiFile();
        }
      } catch (err) {
        errorToast("Erreur MIDI");
      } finally {
        if (isMounted) setMidiLoading(false);
      }
    }
    loadResources();
    return () => {
      isMounted = false;
    };
  }, [exercise.id, loadMidiFile]);

  const tabs: Tab[] = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];

  const value: GameContextType = {
    exercise,
    tabs,
    activeTab,
    setActiveTab,
    midiState: state,
    midiLoading,
    dispatch,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
