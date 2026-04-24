import { useLanguage } from "@/hooks/use-language";
import type { Exercise } from "@/types/entities";
import { createContext, type Dispatch, type SetStateAction, useState, type ReactNode } from "react";

const tabsIds = ["piano-roll", "chords", "sheet", "guitar"] as const;
export type TabID = (typeof tabsIds)[number];
export type Tab = { id: TabID; label: string; disabled?: boolean };

export const GameContext = createContext<{
  exercise: Exercise;
  tabs: Tab[];
  activeTab: TabID;
  setActiveTab: Dispatch<SetStateAction<TabID>>;
} | null>(null);

const GameProvider = ({ exercise, children }: { exercise: Exercise; children: ReactNode }) => {
  const { instance } = useLanguage();
  const tabs: Tab[] = [
    { id: "piano-roll", label: instance.getItem("piano_roll") },
    { id: "chords", label: instance.getItem("chords") },
    { id: "sheet", label: instance.getItem("sheet"), disabled: true },
    { id: "guitar", label: instance.getItem("guitar"), disabled: true },
  ];
  const [activeTab, setActiveTab] = useState<TabID>("chords");

  return (
    <GameContext.Provider value={{ exercise, tabs, activeTab, setActiveTab }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
