import * as z from "zod";

export const activeTracksSchema = z.object({
  piano: z.boolean(),
  guitar: z.boolean(),
  bass: z.boolean(),
  drums: z.boolean(),
});

export const projectConfigSchema = z.object({
  defaultBpm: z
    .number({ error: "The default bpm is required." })
    .nonnegative({ error: "The default bpm cannot be negative" })
    .min(10, { error: "The default bpm is too slow, minimum 10." })
    .max(300, { error: "the default bpm is too fast, max 300." }),
  activeTracks: activeTracksSchema,
});

export const projectSchema = z.object({
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
  midifileId: z.string({ error: "The midi file is missing." }),
  config: projectConfigSchema,
});
