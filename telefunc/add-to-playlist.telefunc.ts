import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import { Status } from "@/types/server-response";
import { getContext } from "telefunc";

export async function onAddPlaylistToPlaylist(targetPlaylistId: number, playlistToAddId: number) {
  const user = getContext().user;

  if (!user)
    return {
      success: false,
      status: Status.NotConnected,
      title: "You are not connected",
    };

  const repository = new PlaylistRepository(prismaClient);
  return handleAction("Add playlist to playlist", () =>
    repository.addPlaylistToPlaylist(targetPlaylistId, playlistToAddId, user.id)
  );
}

export async function onAddExerciseToPlaylist(targetPlaylistId: number, exerciseToAddId: number) {
  const user = getContext().user;

  if (!user)
    return {
      success: false,
      status: Status.NotConnected,
      title: "You are not connected",
    };
  const repository = new PlaylistRepository(prismaClient);
  return handleAction("Add playlist to playlist", () =>
    repository.addExerciseToPlaylist(targetPlaylistId, exerciseToAddId, user.id)
  );
}
