import type { PageContextServer } from "vike/types";
import { getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";

async function getPlaylistFromId(id: number) {
  const repository = new PlaylistRepository(prismaClient);
  return handleAction("get Playlist from id", () => repository.getSingleFromId(id));
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, currentPlaylist] = await Promise.all([
    getGlobalData(pageContext),
    getPlaylistFromId(parseInt(pageContext.routeParams.id, 10)),
  ]);

  return { ...globalData, currentPlaylist };
}
export type Data = Awaited<ReturnType<typeof data>>;
