import type z from "zod";
import type { cellSchema, chordSchema, noteSchema, voltaSchema } from "@/schemas/entities.schema";

export type Cell = z.infer<typeof cellSchema>;

export type Chord = z.infer<typeof chordSchema>;

export type Volta = z.infer<typeof voltaSchema>;

export type Note = z.infer<typeof noteSchema>;

export type ChordIntervals = number[];
export type ChordLabel = string;
export type ChordHarmony = {
  intervals: ChordIntervals;
  labels: ChordLabel[];
  symbolLabel: ChordLabel;
  mmaLabel: ChordLabel;
};
export type ChordDictionary = Record<string, ChordHarmony | null>;
