import MidiController from "@/controllers/MidiController";
import { MMAGrooveTitle } from "@/lib/generated/prisma/enums";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { getContext } from "telefunc";

export default async function onMidiFile(exerciseId: number, groove: MMAGrooveTitle) {
  const { user } = getContext();
  const controller = new MidiController({ client: prismaClient, user });

  return handleAction("Get a midi file", () => {
    return controller.getMidiFile(exerciseId, groove);
  });
}
