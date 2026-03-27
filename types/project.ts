import { playlistSchema } from "@/schemas/frontend";
import z from "zod";
import { Account } from "./account";

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
  haseMelody: boolean;
  config: ExerciseConfig;
  midiFileId: string;
};

export type PlaylistSchema = z.infer<typeof playlistSchema>;

export type Playlist = PlaylistSchema & { id: string; author: string };
