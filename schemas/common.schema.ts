import * as z from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/config/image";

export const imageSchema = z.object({
  url: z.url("Invalid image URL"),
  alt: z.string().min(1, "Alt text is required"),
});

interface FileLike {
  size: number;
  type: string;
}

export const registerImageSchema = z.object({
  file: z
    .custom<FileLike>((val) => {
      return val && typeof val === "object" && "size" in val && "type" in val;
    }, "A valid file is required")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  alt: z.string({ error: "The image description must be provided." }),
});

export const usernameSchema = z
  .string()
  .min(5, "The username must be at least 5 characters.")
  .max(20, "The username must be 20 characters max.");

export const titleSchema = z
  .string()
  .min(1, "The title is too short.")
  .max(100, "The title is too long (max 100).");
