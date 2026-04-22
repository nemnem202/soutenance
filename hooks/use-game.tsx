import { GameContext } from "@/providers/game-provider";
import { useContext } from "react";

export default function useGame() {
  const context = useContext(GameContext);

  if (!context) throw new Error("use game must be used within its provider");

  return context;
}
