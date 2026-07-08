import { useLanguage } from "@/hooks/use-language";
import { Exercise } from "@/types/entities";
import { ReactNode, useEffect, useState } from "react";
import { GameContext, GameContextType, Tab, TabID } from "./game-provider";
import { logger } from "@/lib/logger";

export default function NewGameProvider({
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
