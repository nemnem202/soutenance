import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import PlaylistController from "@/controllers/PlaylistController";
import { getContext } from "telefunc";

export async function onAddPlaylistToPlaylist(targetPlaylistId: number, playlistToAddId: number) {
  const { user } = getContext();
  const controller = new PlaylistController({ client: prismaClient, user });
  return handleAction("Add playlist to playlist", () =>
    controller.addPlaylistToPlaylist(targetPlaylistId, playlistToAddId)
  );
}

export async function onAddExerciseToPlaylist(targetPlaylistId: number, exerciseToAddId: number) {
  const { user } = getContext();
  const controller = new PlaylistController({ client: prismaClient, user });
  return handleAction("Add Exercise to playlist", () =>
    controller.addExerciseToPlaylist(targetPlaylistId, exerciseToAddId)
  );
}

export async function onAddMultiExerciseToPlaylist(
  targetPlaylistId: number,
  exercisesToAddIds: number[]
) {
  const { user } = getContext();
  const controller = new PlaylistController({ client: prismaClient, user });
  return handleAction("Add Multi-Exercises to playlist", () =>
    controller.addManyExercisesToPlaylist(targetPlaylistId, exercisesToAddIds)
  );
}
