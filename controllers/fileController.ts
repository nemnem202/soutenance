import { Readable } from "node:stream";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import type { Session } from "@/types/auth";
import { type ErrorServerResponse, Status } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";

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

  async uploadFileAsImage(): Promise<
    ErrorServerResponse | { success: true; url: string; imageId: string }
  > {
    try {
      if (!this.deps.file) throw new Error("File controller init without file");
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: this.image_folder,
            format: "webp",
            resource_type: "image",
            transformation: [{ width: 1000, crop: "limit", quality: "auto" }],
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No result from Cloudinary"));
            resolve(result);
          }
        );
        // biome-ignore lint/suspicious/noTsIgnore: intentional
        // @ts-ignore
        Readable.fromWeb(this.deps.file.stream()).pipe(uploadStream);
      });

      return {
        success: true,
        url: result.secure_url,
        imageId: result.public_id,
      };
    } catch (error: any) {
      return {
        success: false,
        status: Status.ImageUploadFail,
        title: "Upload failed",
        description: error.message || "An unexpected error occurred during the image upload.",
      };
    }
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

  async handleUserImageChange(
    user: { id: number } | null
  ): Promise<ErrorServerResponse | { success: true; session: Session }> {
    try {
      if (!user)
        return {
          success: false,
          status: Status.NotConnected,
          title: "You are not connected",
        };

      await this.removeUserImage(user.id);

      const fileUpload = await this.uploadFileAsImage();

      if (!fileUpload.success) return fileUpload;

      const update = await this.deps.client.user.update({
        where: {
          id: user.id,
        },
        data: {
          profilePicture: {
            update: {
              url: fileUpload.url,
              cloudId: fileUpload.imageId,
            },
          },
        },
        include: {
          profilePicture: true,
        },
      });

      logger.info(`User ${update.username} upated his profile picture`);

      return {
        success: true,
        session: {
          id: user.id,
          username: update.username,
          profilePictureSource: {
            alt: update.profilePicture.alt,
            src: update.profilePicture.url,
          },
        },
      };
    } catch (err) {
      logger.error("Failed to upload image", err);
      return {
        success: false,
        title: "Internal server error",
        description: "Try later",
        status: Status.UnknownError,
      };
    }
  }
}
