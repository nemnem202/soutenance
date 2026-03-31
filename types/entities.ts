import type z from "zod";
import type { playlistSchema } from "@/schemas/entities.schema";

export type Account = {
  id: string;
  firstName: string;
  lastName?: string;
  picture: string;
};

export type ExerciseConfig = {
  bpm: number;
};

export type Exercise = {
  id: string;
  title: string;
  author: string;
  account: Account;
  creation: Date;
  hasChords: boolean;
  hasMelody: boolean;
  config: ExerciseConfig;
  midiFileId: string;
};

export type PlaylistSchema = z.infer<typeof playlistSchema>;

export type Playlist = PlaylistSchema & { id: string; author: string };
