import LikeController from "@/controllers/LikeController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { getContext } from "telefunc";

export async function onUserLikesPlaylist(playlistId: number) {
  const { user } = getContext();
  const controller = new LikeController({ client: prismaClient, user });
  return handleAction("User likes playlist", () => controller.userLikesPlaylist(playlistId));
}

export async function onUserLikesExercise(exerciseId: number) {
  const { user } = getContext();
  const controller = new LikeController({ client: prismaClient, user });
  return handleAction("User likes Exercise", () => controller.userLikesExercise(exerciseId));
}

export async function onUserLikesUser(likedUserId: number) {
  const { user } = getContext();
  const controller = new LikeController({ client: prismaClient, user });
  return handleAction("User likes User", () => controller.userLikesUser(likedUserId));
}

export async function onUserUnlikesPlaylist(playlistId: number) {
  const { user } = getContext();
  const controller = new LikeController({ client: prismaClient, user });
  return handleAction("User unlikes playlist", () => controller.userUnlikesPlaylist(playlistId));
}

export async function onUserUnlikesExercise(exerciseId: number) {
  const { user } = getContext();
  const controller = new LikeController({ client: prismaClient, user });
  return handleAction("User unlikes Exercise", () => controller.userUnlikesExercise(exerciseId));
}

export async function onUserUnlikesUser(likedUserId: number) {
  const { user } = getContext();
  const controller = new LikeController({ client: prismaClient, user });
  return handleAction("User unlikes User", () => controller.userUnlikesUser(likedUserId));
}
