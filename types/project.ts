import { projectSchema } from "@/schemas/frontend";
import z from "zod";
import { Artist } from "./artist";

export type ExerciceConfig = {
  bpm: number;
};

export type Exercice = {
  id: string;
  title: string;
  composer: Artist;
  author: string;
  creation: Date;
  hasChords: boolean;
  haseMelody: boolean;
  config: ExerciceConfig;
  midiFileId: string;
};

export type ProjectSchema = z.infer<typeof projectSchema>;

export type Project = ProjectSchema & { id: string; author: string };
