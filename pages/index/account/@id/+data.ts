import type { PageContextServer } from "vike/types";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import UserRepository from "@/repositories/userRepository";

async function getAccountFromId(id: number, pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repository = new UserRepository(prismaClient);
  return handleAction("get Playlist from id", () => repository.getSingleFromId(id, userId));
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, currentAccount] = await Promise.all([
    getGlobalData(pageContext),
    getAccountFromId(parseInt(pageContext.routeParams.id, 10), pageContext),
  ]);

  return { ...globalData, currentAccount };
}
export type Data = Awaited<ReturnType<typeof data>>;
