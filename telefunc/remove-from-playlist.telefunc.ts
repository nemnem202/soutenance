import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import { Status } from "@/types/server-response";
import { getContext } from "telefunc";

export async function onRemoveExerciseFromPlaylist(
  targetPlaylistId: number,
  exerciseToRemoveId: number
) {
  const user = getContext().user;

  if (!user)
    return {
      success: false,
      status: Status.NotConnected,
      title: "You are not connected",
    };

  const repository = new PlaylistRepository(prismaClient);
  return handleAction("REmove Exercise from playlist", () =>
    repository.removeExerciseFromPlaylist(targetPlaylistId, exerciseToRemoveId, user.id)
  );
}
