import LikeController from "@/controllers/LikeController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { getContext } from "telefunc";

export async function onUserLikesPlaylist(playlistId: number) {
  const context = getContext();
  const userId = context.user?.id ?? null;
  const controller = new LikeController({ client: prismaClient });
  return handleAction("User likes playlist", () =>
    controller.userLikesPlaylist(userId, playlistId)
  );
}

export async function onUserLikesExercise(exerciseId: number) {
  const context = getContext();
  const userId = context.user?.id ?? null;
  const controller = new LikeController({ client: prismaClient });
  return handleAction("User likes Exercise", () =>
    controller.userLikesExercise(userId, exerciseId)
  );
}

export async function onUserLikesUser(likedUserId: number) {
  const context = getContext();
  const userId = context.user?.id ?? null;
  const controller = new LikeController({ client: prismaClient });
  return handleAction("User likes User", () => controller.userLikesExercise(userId, likedUserId));
}
