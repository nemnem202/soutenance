import { Exercise } from "@/types/entities";
import { createContext, ReactNode } from "react";

export const GameContext = createContext<{ exercise: Exercise } | null>(null);

const GameProvider = ({ exercise, children }: { exercise: Exercise; children: ReactNode }) => {
  return <GameContext.Provider value={{ exercise }}>{children}</GameContext.Provider>;
};

export default GameProvider;
