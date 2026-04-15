import type { PageContextServer } from "vike/types";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import UserRepository from "@/repositories/userRepository";

async function getPopularPlaylists(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new PlaylistRepository(prismaClient);
  return handleAction("Get popular playlists", () => repo.getSortedByPopularity(userId));
}

async function getDiscoverPlaylists(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new PlaylistRepository(prismaClient);
  return handleAction("Get discover playlists", () => repo.getDiscover(userId));
}

async function getRecommendedUsers(pageContext: PageContextServer) {
  const repo = new UserRepository(prismaClient);
  return handleAction("Get recommended users", () => repo.getRecommended());
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, popular, discover, recommendedUsers] = await Promise.all([
    getGlobalData(pageContext),
    getPopularPlaylists(pageContext),
    getDiscoverPlaylists(pageContext),
    getRecommendedUsers(pageContext),
  ]);

  return { ...globalData, popular, discover, recommendedUsers };
}
export type Data = Awaited<ReturnType<typeof data>>;
