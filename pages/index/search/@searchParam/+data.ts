import type { PageContextServer } from "vike/types";
import { getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import SearchRepository from "@/repositories/searchRepository";

async function getSearchedPlaylists(query: string) {
  const repo = new SearchRepository(prismaClient);
  return handleAction("Get searched playlists", () => repo.getPlaylists(query));
}

async function getSearchedExercises(query: string) {
  const repo = new SearchRepository(prismaClient);
  return handleAction("Get searched exercises", () => repo.getExercises(query));
}

async function getSearchedUsers(query: string) {
  const repo = new SearchRepository(prismaClient);
  return handleAction("Get searched users", () => repo.getUsers(query));
}

export default async function data(pageContext: PageContextServer) {
  const query = pageContext.routeParams.searchParam;
  const [globalData, playlists, exercises, users] = await Promise.all([
    getGlobalData(pageContext),
    getSearchedPlaylists(query),
    getSearchedExercises(query),
    getSearchedUsers(query),
  ]);

  return { ...globalData, playlists, exercises, users };
}
export type Data = Awaited<ReturnType<typeof data>>;
