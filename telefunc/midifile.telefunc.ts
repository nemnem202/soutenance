import MidiController from "@/controllers/MidiController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { getContext } from "telefunc";

export default async function onMidiFile(exerciseId: number) {
  const { user } = getContext();
  const controller = new MidiController({ client: prismaClient, user });

  return handleAction("Get a midi file", () => {
    return controller.getMidiFile(exerciseId);
  });
}
