import { Readable } from "node:stream";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "@/lib/env";
import { ServerResponse, Status } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import { AppError } from "@/lib/errors";
import { Session } from "@/types/auth";

interface FileDeps extends ControllerDeps {
  file?: File;
}

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
  secure: true,
});

export default class FileController extends Controller<FileDeps> {
  private readonly image_folder = env.CLOUD_IMAGE_FOLDER_NAME;

  async uploadFileAsImage() {
    if (!this.deps.file) throw new AppError(Status.UnknownError, "Fichier manquant");

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: this.image_folder, format: "webp", resource_type: "image" },
          (error, res) => (error ? reject(error) : resolve(res!))
        );
        Readable.fromWeb(this.deps.file?.stream() as any).pipe(uploadStream);
      });

      return { url: result.secure_url, imageId: result.public_id };
    } catch (error) {
      throw new AppError(Status.ImageUploadFail, "Échec de l'upload", (error as Error).message);
    }
  }

  async handleUserImageChange(user: { id: number } | null): Promise<ServerResponse<Session>> {
    if (!user) throw new AppError(Status.NotConnected, "Vous devez être connecté");

    await this.removeUserImage(user.id);
    const fileUpload = await this.uploadFileAsImage();

    const update = await this.deps.client.user.update({
      where: { id: user.id },
      data: { profilePicture: { update: { url: fileUpload.url, cloudId: fileUpload.imageId } } },
      include: { profilePicture: true },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {
        id: user.id,
        username: update.username,
        profilePictureSource: { alt: update.profilePicture.alt, src: update.profilePicture.url },
      },
    };
  }

  async removeUserImage(userId: number) {
    const existingUser = await this.deps.client.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profilePicture: true,
      },
    });

    if (!existingUser) throw new Error("Existing user not found in db");

    if (existingUser.profilePicture.cloudId) {
      await cloudinary.uploader.destroy(existingUser.profilePicture.cloudId);
    }
  }
}
