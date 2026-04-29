import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
} from "react";
import { useLanguage } from "@/hooks/use-language";
import type { Exercise } from "@/types/entities";
import type { State as MidiState } from "@/midi-editor/types/instance";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/midi-editor/lib/midiconverter";
import onMidiFile from "@/telefunc/midifile.telefunc";
import { errorToast } from "@/lib/toaster";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action, type MidiAction } from "@/midi-editor/types/actions";
import SoundEngine from "@/midi-editor/engines/sound-engine";
import { logger } from "@/lib/logger";

const tabsIds = ["piano-roll", "chords", "sheet", "guitar"] as const;
export type TabID = (typeof tabsIds)[number];
export type Tab = { id: TabID; label: string; disabled?: boolean };

export interface GameContextType {
  exercise: Exercise;
  tabs: Tab[];
  activeTab: TabID;
  setActiveTab: Dispatch<SetStateAction<TabID>>;
  isLoading: boolean;
  audioReady: boolean;
  isReady: boolean;
  midiState: MidiState | null;
  dispatch: (action: MidiAction) => void;
  setAudioStarted: (started: boolean) => void;
  togglePlay: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const isStoreSet = useRef(false);
  const dispatch = useMidiStore((s) => s.dispatch);
  const state = useMidiStore((s) => s.state);
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const tabs: Tab[] = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];

  const startAudio = useCallback(async () => {
    try {
      if (!SoundEngine.initialized) {
        const engine = await SoundEngine.init(state, () => {}, dispatch);
        engine.updateMidiEvents();
        setAudioReady(true);
      }
    } catch (error) {
      logger.error("CRITICAL: startAudio failed", error);
    }
  }, [state, dispatch]);

  const togglePlay = () => dispatch({ type: Action.TOGGLE_PLAY });

  useEffect(() => {
    async function loadResources() {
      setIsLoading(true);
      try {
        const response = await onMidiFile(exercise.id);
        if (response.success) {
          const midiFile = await getMidiFileFromBuffer(response.data);
          const state = await convertMidiFileToState(midiFile);
          if (!isStoreSet.current) {
            useMidiStore.setState({ state });
            isStoreSet.current = true;
          }
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

  useEffect(() => {
    if (!isLoading && audioStarted) startAudio();
  }, [audioStarted, startAudio, isLoading]);

  useEffect(() => {
    return () => {
      logger.info("Game provider dismount");
      if (SoundEngine.initialized) SoundEngine.get().destroy();
    };
  }, []);

  const value: GameContextType = {
    exercise,
    tabs,
    activeTab,
    setActiveTab,
    midiState: state,
    isLoading,
    audioReady,
    isReady: !isLoading && !!state,
    dispatch,
    setAudioStarted,
    togglePlay,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
