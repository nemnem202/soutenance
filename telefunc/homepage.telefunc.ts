import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";

export async function getPopularPlaylists() {
  const repo = new PlaylistRepository(prismaClient);
  return handleAction("Get popular playlists", () => repo.getSortedByPopularity());
}

export async function getDiscoverPlaylists() {
  const repo = new PlaylistRepository(prismaClient);
  return handleAction("Get discover playlists", () => repo.getDiscover());
}
