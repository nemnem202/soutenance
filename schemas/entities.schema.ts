import * as z from "zod";
import { imageSchema, titleSchema } from "./common.schema";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";

export const playlistSchema = z.object({
  image: imageSchema,
  title: titleSchema,
  description: z
    .string()
    .max(500, { error: "The descripition is too long, max 500 caracters." })
    .optional(),
  tags: z
    .array(
      z
        .string()
        .min(1, "One of the tags is too short, min 1 caracter.")
        .max(50, "One of the tags is too long, max 50 caracters.")
    )
    .max(10, { error: "Too many tags, max 10." }),
  exercisesIds: z.array(z.int()),
  userId: z.int(),
  visibility: z.enum(["public", "private"]),
});

export const timeSignatureSchema = z.object({
  top: z.int().min(1).max(32),
  bottom: z.int().min(1).max(32),
});

export const keysSchema = z.string();

export const configSchema = z.object({
  bpm: z.int().min(10, "The bpm is too low, min 20").max(500, "the bpm is too high, max 500"),
  key: keysSchema,
  groove: z.string(),
  timeSignature: timeSignatureSchema,
});

export const sectionType = z.enum([
  "Generic",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "Intro",
  "Verse",
  "Bridge",
  "Solo",
  "Refrain",
  "Melody",
  "Outro",
  "Tacet",
]);

export const noteSchema = z.enum([
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
]);

export const cellKindSchema = z.enum(["Chord", "Spacer", "Empty"]);

export const chordModifierSchema = z.enum(Object.keys(CHORDS_DICTIONNARY));

export const chordContentSchema = z.object({
  note: noteSchema,
  modifier: chordModifierSchema,
});

export const chordSchema = z.object({
  content: chordContentSchema,
  over: chordContentSchema.optional().nullable(),
  alt: chordContentSchema.optional().nullable(),
});

export const cellSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("Chord"),
    chord: chordSchema,
    keychange: keysSchema.optional(),
    timeSignatureChange: timeSignatureSchema.optional(),
  }),

  z.object({
    kind: z.literal("Spacer"),
    keychange: keysSchema.optional(),
    timeSignatureChange: timeSignatureSchema.optional(),
  }),

  z.object({
    kind: z.literal("Empty"),
    keychange: keysSchema.optional(),
    timeSignatureChange: timeSignatureSchema.optional(),
  }),
]);

export const measureSchema = z.object({
  index: z.int(),
  cells: z.array(cellSchema),
});

export const voltaSchema = z.object({
  volta: z.int(),
  measures: z.array(measureSchema).max(200, "The volta has too many measures"),
});

export const sectionSchema = z.object({
  index: z.int(),
  label: z.string().min(1, "The label is empty").max(50, "The label is too long"),
  type: sectionType,
  commonMeasures: z.array(measureSchema).max(200, "The section has too many measures."),
  voltas: z.array(voltaSchema),
});

export const chordsGridSchema = z.object({
  sections: z
    .array(sectionSchema)
    .min(1, "The chord grid is empty")
    .max(200, "The chord grid has too many sections"),
});

export const exerciseSchema = z.object({
  playlistId: z.int(),
  title: titleSchema,
  composer: z
    .string()
    .min(1, "The composer name is too short.")
    .max(200, "The composer name is too long"),
  defaultConfig: configSchema,
  chordsGrid: chordsGridSchema,
});
