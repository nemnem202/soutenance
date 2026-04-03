import { getContext } from "telefunc";
import FileController from "@/controllers/fileController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export async function onImageChange(image: File) {
  const context = getContext();
  const controller = new FileController({ client: prismaClient, file: image });
  return handleAction("Profile Picture Change", () =>
    controller.handleUserImageChange(context.user)
  );
}
