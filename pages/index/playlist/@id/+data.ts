import type { PageContextServer } from "vike/types";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";

async function getPlaylistFromId(playlistId: number, pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repository = new PlaylistRepository(prismaClient);
  return handleAction("get Playlist from id", () => repository.getSingleFromId(playlistId, userId));
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, currentPlaylist] = await Promise.all([
    getGlobalData(pageContext),
    getPlaylistFromId(parseInt(pageContext.routeParams.id, 10), pageContext),
  ]);

  return { ...globalData, currentPlaylist };
}
export type Data = Awaited<ReturnType<typeof data>>;
