import { getContext } from "telefunc";
import FileController from "@/controllers/FileController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export async function onImageChange(image: File) {
  const { user } = getContext();
  const controller = new FileController({ client: prismaClient, user, file: image });
  return handleAction("Profile Picture Change", () => controller.handleUserImageChange());
}
