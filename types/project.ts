import { projectSchema } from "@/schemas/frontend";
import z from "zod";
import { Account } from "./account";

export type ExerciceConfig = {
  bpm: number;
};

export type Exercice = {
  id: string;
  title: string;
  author: string;
  account: Account;
  creation: Date;
  hasChords: boolean;
  haseMelody: boolean;
  config: ExerciceConfig;
  midiFileId: string;
};

export type ProjectSchema = z.infer<typeof projectSchema>;

export type Project = ProjectSchema & { id: string; author: string };
