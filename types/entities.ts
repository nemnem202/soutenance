import type z from "zod";
import type { imageSchema } from "@/schemas/common.schema";
import type {
  barsSchema,
  cellSchema,
  chordSchema,
  chordsGridSchema,
  configSchema,
  exerciseSchema,
  measureSchema,
  playlistSchema,
  sectionSchema,
  timeSignatureSchema,
  voltaSchema,
} from "@/schemas/entities.schema";
import type { Session } from "./auth";

export type Account = {
  id: number;
  firstName: string;
  lastName?: string;
  picture: string;
};

export type ExerciseSchema = z.infer<typeof exerciseSchema>;

export type Exercise = ExerciseSchema & { id: number; author: Session };

export type PlaylistSchema = z.infer<typeof playlistSchema>;

export type Playlist = PlaylistSchema & { id: number; author: Session };

export type Config = z.infer<typeof configSchema>;

export type Image = z.infer<typeof imageSchema>;

export type SectionSchema = z.infer<typeof sectionSchema>;

export type TimeSignatureSchema = z.infer<typeof timeSignatureSchema>;

export type ConfigSchema = z.infer<typeof configSchema>;

export type ChordSchema = z.infer<typeof chordSchema>;

export type ChordsGridSchema = z.infer<typeof chordsGridSchema>;

export type CellSchema = z.infer<typeof cellSchema>;

export type MeasureSchema = z.infer<typeof measureSchema>;

export type VoltaSchema = z.infer<typeof voltaSchema>;

export type BarsSchema = z.infer<typeof barsSchema>;
