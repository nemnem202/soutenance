import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import UserRepository from "@/repositories/userRepository";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import type { UserCardDto } from "@/types/dtos/user";
import type { PlaylistSeeAllQUery, UserSeeAllQUery } from "@/types/navigation";
import { type ServerResponse, Status } from "@/types/server-response";
import { getContext } from "telefunc";

export async function onUserSeeAllRequest(
  search: UserSeeAllQUery,
  start: number,
  length: number
): Promise<ServerResponse<UserCardDto[]>> {
  const context = getContext();
  const userId = context.user?.id ?? null;

  const repo = new UserRepository(prismaClient);

  switch (search) {
    case "popular":
      return handleAction("See all discover accounts", () =>
        repo.getRecommended(userId, start, length)
      );
    default:
      return {
        success: false,
        status: Status.BadRequest,
        title: "Page not found",
      };
  }
}

export async function onPlaylistSeeAllRequest(
  search: PlaylistSeeAllQUery,
  start: number,
  length: number
): Promise<ServerResponse<PlaylistCardDto[]>> {
  const context = getContext();
  const userId = context.user?.id ?? null;

  const repo = new PlaylistRepository(prismaClient);

  switch (search) {
    case "discover":
      return handleAction("See all discover accounts", () =>
        repo.getDiscover(userId, start, length)
      );
    case "popular":
      return handleAction("See all discover accounts", () =>
        repo.getDiscover(userId, start, length)
      );
    case "recent":
      return handleAction("See all discover accounts", () => repo.getRecent(userId, start, length));
    default:
      return {
        success: false,
        status: Status.BadRequest,
        title: "Page not found",
      };
  }
}
