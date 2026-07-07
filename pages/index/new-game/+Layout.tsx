import DEFAULT_EXERCISE from "@/config/default_exercise";
import NewGameProvider from "@/providers/new-game-provider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <NewGameProvider defaultExercise={DEFAULT_EXERCISE}>{children}</NewGameProvider>;
}
