import { ConnexionController } from "@/controllers/ConnexionController";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import { getContext } from "telefunc";

export async function onImageChange(image: File) {
  const context = getContext();
  if (!context.user) return;
  const imageupload = await new ConnexionController({
    client: prismaClient,
    context,
  }).uploadImageFile(image, env.CLOUD_IMAGE_FOLDER_NAME);
  logger.info("Image upload:", imageupload);
  const user = await prismaClient.user.update({
    where: {
      id: context.user.id,
    },
    data: {
      profilePicture: imageupload.url,
    },
  });
  logger.info("new user:", user);
}
