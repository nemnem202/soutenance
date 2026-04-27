import { getContext } from "telefunc";
import UserController from "@/controllers/UserController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export async function onUsernameChange(newUsername: string) {
  const { user } = getContext();
  const controller = new UserController({ client: prismaClient, user });
  return handleAction("Username Change", () => controller.updateUsername(newUsername));
}
