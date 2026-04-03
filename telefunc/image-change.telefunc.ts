import FileController from "@/controllers/fileController";
import prismaClient from "@/lib/prisma-client";
import { getContext } from "telefunc";

export async function onImageChange(image: File) {
  const context = getContext();
  return new FileController({
    client: prismaClient,
    file: image,
  }).handleUserImageChange(context.user);
}
