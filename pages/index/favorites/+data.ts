import type { PageContextServer } from "vike/types";
import { getGlobalData } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import LikeController from "@/controllers/LikeController";
import getCurrentUserFromCookie from "@/middlewares/getCurrentUser";

async function getFavoritesPlaylists(pageContext: PageContextServer) {
  const user = await getCurrentUserFromCookie(pageContext.headers.cookie);
  const repo = new LikeController({ client: prismaClient, user });
  return handleAction("Get searched playlists", () => repo.getPlaylists());
}

async function getFavoritesExercises(pageContext: PageContextServer) {
  const user = await getCurrentUserFromCookie(pageContext.headers.cookie);
  const repo = new LikeController({ client: prismaClient, user });
  return handleAction("Get searched exercises", () => repo.getExercises());
}

async function getFavoritesUsers(pageContext: PageContextServer) {
  const user = await getCurrentUserFromCookie(pageContext.headers.cookie);
  const repo = new LikeController({ client: prismaClient, user });
  return handleAction("Get searched users", () => repo.getUsers());
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
