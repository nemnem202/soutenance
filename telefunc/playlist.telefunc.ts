import PlaylistController from "@/controllers/PlaylistController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import type { PlaylistRegisterData } from "@/types/playlist";
import { type ServerResponse, Status } from "@/types/server-response";
import { getContext } from "telefunc";

export async function onPlaylistCreation(
  playlist: PlaylistRegisterData
): Promise<ServerResponse<{}>> {
  const user = getContext().user;

  if (!user)
    return {
      success: false,
      status: Status.NotConnected,
      title: "You are not connected",
    };

  const controller = new PlaylistController({
    client: prismaClient,
    userId: user.id,
  });
  return handleAction("Login", () => controller.createPlaylistFromUser(playlist));
}

export async function onPlaylistRemove(playlistId: number) {
  const user = getContext().user;

  if (!user)
    return {
      success: false,
      status: Status.NotConnected,
      title: "You are not connected",
    };

  const controller = new PlaylistController({
    client: prismaClient,
    userId: user.id,
  });
  return handleAction("Login", () => controller.removePlaylist(playlistId));
}
