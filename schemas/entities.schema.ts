import * as z from "zod";
import { imageSchema, titleSchema } from "./common.schema";
import { MMAGrooveTitle } from "@/lib/generated/prisma/enums";

export const timeSignatureSchema = z.object({
  top: z.int().min(1).max(32),
  bottom: z.int().min(1).max(32),
});

export const keysSchema = z.string();

export const configSchema = z.object({
  bpm: z.number().int().min(10).max(500),
  key: z.string().max(50),
  groove: z.enum(MMAGrooveTitle),
  timeSignatureTop: z.number().int().min(1).max(32),
  timeSignatureBottom: z.number().int().min(1).max(32),
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

export const notes = [
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
  "%",
];

export const indexesOfNotes: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  "%": -1,
};

export const notesByIndex: Record<number, string> = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};

export const noteSchema = z.enum(notes);

export const cellKindSchema = z.enum(["Chord", "Spacer", "Empty"]);

export const barsSchema = z.object({
  left: z.enum(["single", "double", "loopOpen"]).optional().nullable(),
  right: z.enum(["single", "double", "loopClose", "final"]).optional().nullable(),
});

export const chordchema = z.string();

export const chordContentSchema = z.object({
  note: noteSchema,
  modifier: chordchema,
});

export const chordSchema = z.object({
  content: chordContentSchema,
  over: chordContentSchema.nullable().optional(),
  alt: chordContentSchema.nullable().optional(),
});

export const cellSchema = z.discriminatedUnion("kind", [
  z.object({
    index: z.number().int(),
    kind: z.literal("Chord"),
    chord: chordSchema,
    keychange: z.string().max(50).nullable().optional(),
    timeSignatureChangeTop: z.number().int().nullable().optional(),
    timeSignatureChangeBottom: z.number().int().nullable().optional(),
    isCodaSymbol: z.boolean(),
    isSegnoSymbol: z.boolean(),
    isFermataSymbol: z.boolean(),
  }),
  z.object({
    index: z.number().int(),
    kind: z.literal("Spacer"),
    keychange: z.string().max(50).nullable().optional(),
    timeSignatureChangeTop: z.number().int().nullable().optional(),
    timeSignatureChangeBottom: z.number().int().nullable().optional(),
    isCodaSymbol: z.boolean(),
    isSegnoSymbol: z.boolean(),
    isFermataSymbol: z.boolean(),
  }),
  z.object({
    index: z.number().int(),
    kind: z.literal("Empty"),
    keychange: z.string().max(50).nullable().optional(),
    timeSignatureChangeTop: z.number().int().nullable().optional(),
    timeSignatureChangeBottom: z.number().int().nullable().optional(),
    isCodaSymbol: z.boolean(),
    isSegnoSymbol: z.boolean(),
    isFermataSymbol: z.boolean(),
  }),
]);

export const measureSchema = z.object({
  index: z.number().int(),
  cells: z.array(cellSchema),
  bars: barsSchema,
});

export const voltaSchema = z.object({
  index: z.int(),
  measures: z.array(measureSchema).max(200, "The volta has too many measures"),
});

export const sectionSchema = z.object({
  index: z.number().int(),
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
  title: titleSchema,
  composer: z
    .string()
    .min(1, "The composer name is too short.")
    .max(200, "The composer name is too long"),
  defaultConfig: configSchema,
  chordsGrid: chordsGridSchema.optional().nullable(),
  midifileUrl: z.url().optional().nullable(),
});

export const playlistSchema = z.object({
  cover: imageSchema,
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
  exercises: z.array(exerciseSchema),
  visibility: z.enum(["public", "private"]),
});
