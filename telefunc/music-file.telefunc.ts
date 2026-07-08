import MusicFileController, { JsonAndMidiOutput } from "@/controllers/MusicFileController";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { ChordsGridSchema } from "@/types/entities";
import { ServerResponse, Status } from "@/types/server-response";
import { getContext, shield } from "telefunc";

export default async function onMusicFile(
  file: File,
  chordsGrid?: ChordsGridSchema
): Promise<ServerResponse<JsonAndMidiOutput>> {
  const { user } = getContext();
  // if (!user?.id)
  //   return {
  //     success: false,
  //     status: Status.NotConnected,
  //     title: "You must be connected to access this feature",
  //   };
  const controller = new MusicFileController({ client: prismaClient, file, user: user });
  return handleAction("Music file process", () => controller.getJsonAndMidi());
}

shield(onMusicFile, [shield.type.any, shield.type.any], {});
