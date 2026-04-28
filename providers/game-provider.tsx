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

const tabsIds = ["piano-roll", "chords", "sheet", "guitar"] as const;
export type TabID = (typeof tabsIds)[number];
export type Tab = { id: TabID; label: string; disabled?: boolean };

export interface GameContextType {
  exercise: Exercise;
  tabs: Tab[];
  activeTab: TabID;
  setActiveTab: Dispatch<SetStateAction<TabID>>;
  midiState: MidiState | null;
  isLoading: boolean;
  isReady: boolean;
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
  const [midiState, setMidiState] = useState<MidiState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs: Tab[] = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];

  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      try {
        const response = await onMidiFile(exercise.id);
        if (response.success) {
          const midiFile = await getMidiFileFromBuffer(response.data);
          const state = await convertMidiFileToState(midiFile);
          setMidiState(state);
        } else {
          errorToast(response.title, response.description);
        }
      } catch (err) {
        errorToast("Erreur de chargement des ressources");
      } finally {
        setIsLoading(false);
      }
    }

    loadResources();
  }, [exercise.id]);

  const value = {
    exercise,
    tabs,
    activeTab,
    setActiveTab,
    midiState,
    isLoading,
    isReady: !isLoading && !!midiState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
