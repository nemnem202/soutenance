import { Readable } from "node:stream";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import UserRepository from "@/repositories/userRepository";
import type { Session } from "@/types/auth";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller, ControllerDeps } from "./Controller";

interface FileDeps extends ControllerDeps {
  file?: File;
}

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_API_SECRET,
  secure: true,
});

export default class FileController extends Controller {
  private repository: UserRepository;
  private file?: File;
  private readonly image_folder = env.CLOUD_IMAGE_FOLDER_NAME;

  constructor(deps: FileDeps) {
    super(deps);
    this.repository = new UserRepository(this.client);
    this.file = deps.file;
  }

  async uploadFileAsImage() {
    if (!this.file) throw new AppError(Status.UnknownError, "Fichier manquant");

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: this.image_folder, format: "webp", resource_type: "image" },
          (error, res) => (error ? reject(error) : resolve(res!))
        );
        Readable.fromWeb(this.file?.stream() as any).pipe(uploadStream);
      });

      return { url: result.secure_url, imageId: result.public_id };
    } catch (error) {
      throw new AppError(Status.ImageUploadFail, "Échec de l'upload", (error as Error).message);
    }
  }

  async handleUserImageChange(): Promise<ServerResponse<Session>> {
    const userId = this.okUser();
    await this.removeUserImage(userId);
    const fileUpload = await this.uploadFileAsImage();
    const update = await this.repository.updateImage(fileUpload, userId);

    return {
      success: true,
      status: Status.Ok,
      data: {
        id: userId,
        username: update.username,
        profilePicture: update.profilePicture,
      },
    };
  }

  async removeUserImage(userId: number) {
    const existingUser = await this.client.user.findUnique({
      where: { id: userId },
      include: { profilePicture: true },
    });

    if (existingUser?.profilePicture.cloudId) {
      await cloudinary.uploader.destroy(existingUser.profilePicture.cloudId);
    }
  }
}
