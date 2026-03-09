import { playlistSchema } from "@/schemas/frontend";
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

export type PlaylistSchema = z.infer<typeof playlistSchema>;

export type Playlist = PlaylistSchema & { id: string; author: string };
