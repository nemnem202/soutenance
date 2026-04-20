import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import UserRepository from "@/repositories/userRepository";
import { UserCardDto } from "@/types/dtos/user";
import { UserSeeAllQUery } from "@/types/navigation";
import { ServerResponse, Status } from "@/types/server-response";
import { PageContextServer } from "vike/types";

async function getSeeAllData(
  pageContext: PageContextServer
): Promise<ServerResponse<UserCardDto[]>> {
  const search = pageContext.urlParsed.search.search as UserSeeAllQUery;

  logger.info("Search param: ", search);

  if (!search)
    return {
      success: false,
      status: Status.BadRequest,
      title: "Page not found",
    };

  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new UserRepository(prismaClient);

  switch (search) {
    case "popular":
      return handleAction("See all discover accounts", () => repo.getRecommended(userId, 0, 40));
    default:
      return {
        success: false,
        status: Status.BadRequest,
        title: "Page not found",
      };
  }
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, accounts] = await Promise.all([
    getGlobalData(pageContext),
    getSeeAllData(pageContext),
  ]);

  return { ...globalData, accounts };
}
export type Data = Awaited<ReturnType<typeof data>>;
