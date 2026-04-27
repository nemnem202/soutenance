import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import type { PlaylistSeeAllQUery } from "@/types/navigation";
import { type ServerResponse, Status } from "@/types/server-response";
import type { PageContextServer } from "vike/types";

async function getSeeAllData(
  pageContext: PageContextServer
): Promise<ServerResponse<PlaylistCardDto[]>> {
  const search = pageContext.urlParsed.search.search as PlaylistSeeAllQUery;

  logger.info("Search param: ", search);

  if (!search)
    return {
      success: false,
      status: Status.BadRequest,
      title: "Page not found",
    };
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new PlaylistRepository(prismaClient);

  switch (search) {
    case "discover":
      return handleAction("See all discover playlists", () => repo.getDiscover(userId, 0, 40));
    case "popular":
      return handleAction("See all popular playlists", () =>
        repo.getSortedByPopularity(userId, 0, 40)
      );
    case "recent":
      return handleAction("See all recent playlists", () => repo.getRecent(userId, 0, 40));
    default:
      return {
        success: false,
        status: Status.BadRequest,
        title: "Page not found",
      };
  }
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, playlists] = await Promise.all([
    getGlobalData(pageContext),
    getSeeAllData(pageContext),
  ]);

  return { ...globalData, playlists };
}
export type Data = Awaited<ReturnType<typeof data>>;
