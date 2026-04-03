import type z from "zod";
import type { imageSchema } from "@/schemas/common.schema";
import type { playlistSchema } from "@/schemas/entities.schema";

export type Account = {
  id: number;
  firstName: string;
  lastName?: string;
  picture: string;
};

export type ExerciseConfig = {
  bpm: number;
};

export type Exercise = {
  id: number;
  title: string;
  author: string;
  account: Account;
  creation: Date;
  hasChords: boolean;
  hasMelody: boolean;
  config: ExerciseConfig;
  midiFileId: number;
};

export type PlaylistSchema = z.infer<typeof playlistSchema>;

export type Playlist = PlaylistSchema & { id: number; author: string };

export type Image = z.infer<typeof imageSchema>;
