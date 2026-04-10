import type z from "zod";
import type { imageSchema } from "@/schemas/common.schema";
import type { configSchema, exerciseSchema, playlistSchema } from "@/schemas/entities.schema";
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
