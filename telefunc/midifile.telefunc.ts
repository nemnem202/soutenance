import MidiController from "@/controllers/MidiController";
import { handleAction } from "@/lib/response-handler";

export default async function onMidiFile(exerciseId: number) {
  const controller = new MidiController();
  return handleAction("Generate a midi file", () => {
    return controller.getMidiFromChords();
  });
}
