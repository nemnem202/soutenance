import type { Image } from "../entities";
import type { PlaylistDTO } from "./playlist";

export interface ExerciseDto {
  id: number;
  authorId: number;
  title: string;
}

export interface ExerciseCardDto extends ExerciseDto {
  description?: string;
  cover: Image;
  likes: number;
  likedByCurrentUser: boolean;
  inUserPlaylists: PlaylistDTO[];
}
