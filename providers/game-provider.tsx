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
import type { State as state } from "@/midi-editor/types/instance";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/converters/midi-to-state";
import { errorToast } from "@/lib/toaster";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action, type MidiAction } from "@/midi-editor/types/actions";
import useAudio from "@/hooks/use-audio";
import { useShortcuts } from "@/midi-editor/hooks/useShortcuts";
import SoundEngine from "@/midi-editor/engines/sound/sound-engine";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/game/@id/+data";
import { logger } from "@/lib/logger";

const tabsIds = ["piano-roll", "chords-grid", "chords-carousel", "sheet", "guitar"] as const;
export type TabID = (typeof tabsIds)[number];
export type Tab = { id: TabID; label: string; disabled?: boolean };

export interface GameContextType {
  exercise: Exercise;
  updateExercise: Dispatch<SetStateAction<Exercise>>;
  tabs: Tab[];
  activeTab: TabID;
  setActiveTab: Dispatch<SetStateAction<TabID>>;
  midiLoading: boolean;
  setMidiLoading: Dispatch<SetStateAction<boolean>>;
}

export const GameContext = createContext<GameContextType | null>(null);

export default function GameProvider({
  defaultExercise,
  children,
}: {
  defaultExercise: Exercise;
  children: ReactNode;
}) {
  const { instance } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabID>("chords-grid");
  const [midiLoading, setMidiLoading] = useState(true);
  const [exercise, updateExercise] = useState(defaultExercise);
  const dispatch = useMidiStore((s) => s.dispatch);

  useShortcuts();

  const { midiBase64 } = useData<Data>();

  useEffect(() => {
    let isMounted = true;
    useMidiStore.setState({ state: null });

    async function loadResources() {
      try {
        const binaryStr = atob(midiBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const midiFile = await getMidiFileFromBuffer(bytes);
        if (!isMounted) return;

        const newState = convertMidiFileToState(midiFile, exercise);
        useMidiStore.setState({ state: newState });
      } catch (err) {
        errorToast("Erreur de chargement de l'exercice");
      }
    }

    loadResources();

    return () => {
      dispatch({ type: Action.RESET_STATE });
      isMounted = false;
      useMidiStore.getState().reset();
    };
  }, [exercise.id]);

  const tabs: Tab[] = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords-grid", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];

  const value: GameContextType = {
    exercise,
    updateExercise,
    tabs,
    activeTab,
    setActiveTab,
    midiLoading,
    setMidiLoading,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
