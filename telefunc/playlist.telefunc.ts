import PlaylistController from "@/controllers/PlaylistController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import type { PlaylistRegisterData } from "@/types/playlist";
import { getContext } from "telefunc";

export async function onPlaylistCreation(playlist: PlaylistRegisterData) {
  const { user } = getContext();
  const controller = new PlaylistController({ client: prismaClient, user });
  return handleAction("Playlist Creation", () => controller.createPlaylistFromUser(playlist));
}

export async function onPlaylistRemove(playlistId: number) {
  const { user } = getContext();
  const controller = new PlaylistController({ client: prismaClient, user });
  return handleAction("Playlist Removal", () => controller.removePlaylist(playlistId));
}
