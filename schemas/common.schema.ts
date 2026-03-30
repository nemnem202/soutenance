import * as z from "zod";

export const imageSchema = z.object({
  src: z.string({ error: "The image must be provided." }),
  alt: z.string({ error: "The image description must be provided." }),
});
