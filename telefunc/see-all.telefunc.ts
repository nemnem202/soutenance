import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import UserRepository from "@/repositories/userRepository";
import { UserCardDto } from "@/types/dtos/user";
import { UserSeeAllQUery } from "@/types/navigation";
import { ServerResponse, Status } from "@/types/server-response";
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
