import * as z from "zod";

export const imageSchema = z.object({
  src: z.string({ error: "The image must be provided." }),
  alt: z.string({ error: "The image description must be provided." }),
});

export const projectSchema = z.object({
  image: imageSchema,
  title: z
    .string({
      error: "The title is required.",
    })
    .min(1, { error: "The title is too short." })
    .max(100, { error: "The title is too long, max 100 caracters." }),
  composer: z
    .string({
      error: "The composer name is required.",
    })
    .min(1, { error: "The composer name is too short." })
    .max(100, { error: "The composer name is too long, max 100 caracters." }),
  description: z.string().max(500, { error: "The descripition is too long, max 100 caracters." }).optional(),
  tags: z
    .array(
      z
        .string()
        .min(1, "One of the tags is too short, min 1 caracter.")
        .max(50, "One of the tags is too long, max 50 caracters."),
    )

    .max(10, { error: "Too many tags, max 10." }),
});
