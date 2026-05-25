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
import { errorToast } from "@/lib/toaster";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action, type MidiAction } from "@/midi-editor/types/actions";
import useAudio from "@/hooks/use-audio";
import { useShortcuts } from "@/midi-editor/hooks/useShortcuts";
import SoundEngine from "@/midi-editor/engines/sound-engine";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/game/@id/+data";

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

  useShortcuts();

  const { midiBase64 } = useData<Data>();

  useEffect(() => {
    let isMounted = true;
    useMidiStore.setState({ state: null });

    async function loadResources() {
      try {
        // Décoder le base64 → buffer
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
      isMounted = false;
      SoundEngine.reset();
      useMidiStore.getState().reset();
      dispatch({ type: Action.RESET_STATE });
    };
  }, [exercise.id]);

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
