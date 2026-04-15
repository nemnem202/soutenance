import type { PageContextServer } from "vike/types";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import SearchRepository from "@/repositories/searchRepository";

async function getSearchedPlaylists(query: string, pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new SearchRepository(prismaClient);
  return handleAction("Get searched playlists", () => repo.getPlaylists(query, userId));
}

async function getSearchedExercises(query: string) {
  const repo = new SearchRepository(prismaClient);
  return handleAction("Get searched exercises", () => repo.getExercises(query));
}

async function getSearchedUsers(query: string, pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new SearchRepository(prismaClient);
  return handleAction("Get searched users", () => repo.getUsers(query, userId));
}

export default async function data(pageContext: PageContextServer) {
  const query = pageContext.routeParams.searchParam;
  const [globalData, playlists, exercises, users] = await Promise.all([
    getGlobalData(pageContext),
    getSearchedPlaylists(query, pageContext),
    getSearchedExercises(query),
    getSearchedUsers(query, pageContext),
  ]);

  return { ...globalData, playlists, exercises, users };
}
export type Data = Awaited<ReturnType<typeof data>>;
