import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import PlaylistController from "@/controllers/PlaylistController";
import { getContext } from "telefunc";

export async function onRemoveExerciseFromPlaylist(
  targetPlaylistId: number,
  exerciseToRemoveId: number
) {
  const { user } = getContext();
  const controller = new PlaylistController({ client: prismaClient, user });
  return handleAction("Remove Exercise from playlist", () =>
    controller.removeExerciseFromPlaylist(targetPlaylistId, exerciseToRemoveId)
  );
}
