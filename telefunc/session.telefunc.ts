import { getContext } from "telefunc";
import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export async function onSessionRequest() {
  const context = getContext();
  return handleAction("Fetch Session", async () => {
    const userId = context.user?.id ?? null;
    const controller = await new SessionController({ client: prismaClient });
    return handleAction("Profile Picture Change", () => controller.getSession(userId));
  });
}

export async function getUserPlaylists() {
  const context = getContext();

  return handleAction("Get user playlist", async () => {
    const userId = context.user?.id ?? null;
    const controller = await new SessionController({ client: prismaClient });
    return handleAction("Profile Picture Change", () => controller.getUserPlaylists(userId));
  });
}
