import { getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import UserRepository from "@/repositories/userRepository";
import type { PageContextServer } from "vike/types";

async function getPopularPlaylists() {
  const repo = new PlaylistRepository(prismaClient);
  return handleAction("Get popular playlists", () => repo.getSortedByPopularity());
}

async function getDiscoverPlaylists() {
  const repo = new PlaylistRepository(prismaClient);
  return handleAction("Get discover playlists", () => repo.getDiscover());
}

async function getRecommendedUsers() {
  const repo = new UserRepository(prismaClient);
  return handleAction("Get discover playlists", () => repo.getRecommended());
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, popular, discover, recommendedUsers] = await Promise.all([
    getGlobalData(pageContext),
    getPopularPlaylists(),
    getDiscoverPlaylists(),
    getRecommendedUsers(),
  ]);

  return { ...globalData, popular, discover, recommendedUsers };
}
export type Data = Awaited<ReturnType<typeof data>>;
