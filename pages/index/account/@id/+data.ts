import { getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import UserRepository from "@/repositories/userRepository";
import type { PageContextServer } from "vike/types";

async function getAccountFromId(id: number) {
  const repository = new UserRepository(prismaClient);
  return handleAction("get Playlist from id", () => repository.getSingleFromId(id));
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, currentAccount] = await Promise.all([
    getGlobalData(pageContext),
    getAccountFromId(parseInt(pageContext.routeParams.id, 10)),
  ]);

  return { ...globalData, currentAccount };
}
export type Data = Awaited<ReturnType<typeof data>>;
