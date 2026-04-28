import { getContext } from "telefunc";
import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export async function onSessionRequest() {
  const { user } = getContext();
  const controller = new SessionController({ client: prismaClient, user });
  return handleAction("Fetch Session", () => controller.getSession());
}

export async function getUserPlaylists() {
  const { user } = getContext();
  const controller = new SessionController({ client: prismaClient, user });
  return handleAction("Get user playlists", () => controller.getUserPlaylists());
}
