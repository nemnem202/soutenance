import * as z from "zod";
import { imageSchema } from "./common.schema";

export const playlistSchema = z.object({
  image: imageSchema,
  title: z
    .string({
      error: "The title is required.",
    })
    .min(1, { error: "The title is too short." })
    .max(100, { error: "The title is too long, max 100 caracters." }),
  description: z
    .string()
    .max(500, { error: "The descripition is too long, max 100 caracters." })
    .optional(),
  tags: z
    .array(
      z
        .string()
        .min(1, "One of the tags is too short, min 1 caracter.")
        .max(50, "One of the tags is too long, max 50 caracters."),
    )
    .max(10, { error: "Too many tags, max 10." }),
  exercisesIds: z.array(z.string()),
  accountId: z.uuid(),
  visibility: z.enum(["public", "private"]),
});
