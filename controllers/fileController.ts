import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { Controller, type ControllerDeps } from "./Controller";
import { env } from "@/lib/env";
import { Readable } from "stream";
import { logger } from "@/lib/logger";
import { type ErrorServerResponse, Status } from "@/types/server-response";
import type { Session } from "@/types/auth";

interface FileDeps extends ControllerDeps {
  file: File;
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
    ErrorServerResponse | { success: true; url: string }
  > {
    try {
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
          },
        );
        // biome-ignore lint/suspicious/noTsIgnore: intentional
        // @ts-ignore
        Readable.fromWeb(this.deps.file.stream()).pipe(uploadStream);
      });

      return {
        success: true,
        url: result.secure_url,
      };
    } catch (error: any) {
      return {
        success: false,
        status: Status.ImageUploadFail,
        title: "Upload failed",
        description:
          error.message ||
          "An unexpected error occurred during the image upload.",
      };
    }
  }

  async handleUserImageChange(
    user: { id: number } | null,
  ): Promise<ErrorServerResponse | { success: true; session: Session }> {
    try {
      if (!user)
        return {
          success: false,
          status: Status.NotConnected,
          title: "You are not connected",
        };

      const fileUpload = await this.uploadFileAsImage();

      if (!fileUpload.success) return fileUpload;

      const update = await this.deps.client.user.update({
        where: {
          id: user.id,
        },
        data: {
          profilePicture: fileUpload.url,
        },
      });

      return {
        success: true,
        session: {
          id: user.id,
          profilePictureSource: update.profilePicture,
          username: update.username,
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
