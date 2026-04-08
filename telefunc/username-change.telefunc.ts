import UserController from "@/controllers/UserController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import { getContext } from "telefunc";

export async function onUsernameChange(newUsername: string) {
  const context = getContext();
  const controller = new UserController({ client: prismaClient });
  const userId = context.user?.id ?? null;
  return handleAction("Profile Picture Change", () =>
    controller.updateUsername(userId, newUsername)
  );
}
