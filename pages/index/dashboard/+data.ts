import type { PageContextServer } from "vike/types";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import UserRepository from "@/repositories/userRepository";
import { type ServerResponse, Status } from "@/types/server-response";
import type { UserDetailsDto } from "@/types/dtos/user";

async function getUserAccount(
  pageContext: PageContextServer
): Promise<ServerResponse<UserDetailsDto>> {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  if (!session?.id)
    return {
      success: false,
      status: Status.NotConnected,
      title: "You are not connected",
    };
  const userId = session.id;
  const repository = new UserRepository(prismaClient);
  return handleAction("get Playlist from id", () => repository.getSingleFromId(userId, userId));
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, currentAccount] = await Promise.all([
    getGlobalData(pageContext),
    getUserAccount(pageContext),
  ]);

  return { ...globalData, currentAccount };
}
export type Data = Awaited<ReturnType<typeof data>>;
