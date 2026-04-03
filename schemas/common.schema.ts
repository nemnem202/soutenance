import * as z from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/config/image";

export const imageSchema = z.object({
  src: z.string({ error: "The image must be provided." }),
  alt: z.string({ error: "The image description must be provided." }),
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
