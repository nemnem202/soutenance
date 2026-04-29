import { AudioContext } from "@/providers/audio-provider";
import { useContext } from "react";

export default function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("Use Audio must be used within it's provider");
  return context;
}
