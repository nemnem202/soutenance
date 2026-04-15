import type { PageContextServer } from "vike/types";
import { getAuthenticatedSession, getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import LikeController from "@/controllers/LikeController";

async function getFavoritesPlaylists(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new LikeController({ client: prismaClient });
  return handleAction("Get searched playlists", () => repo.getPlaylists(userId));
}

async function getFavoritesExercises(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new LikeController({ client: prismaClient });
  return handleAction("Get searched exercises", () => repo.getExercises(userId));
}

async function getFavoritesUsers(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const repo = new LikeController({ client: prismaClient });
  return handleAction("Get searched users", () => repo.getUsers(userId));
}

export default async function data(pageContext: PageContextServer) {
  const [globalData, playlists, exercises, users] = await Promise.all([
    getGlobalData(pageContext),
    getFavoritesPlaylists(pageContext),
    getFavoritesExercises(pageContext),
    getFavoritesUsers(pageContext),
  ]);

  return { ...globalData, playlists, exercises, users };
}
export type Data = Awaited<ReturnType<typeof data>>;
