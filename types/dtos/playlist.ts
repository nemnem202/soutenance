import type { Session } from "../auth";
import type { Image } from "../entities";
import type { ExerciseCardDto } from "./exercise";

export interface PlaylistDTO {
  id: number;
  title: string;
  exercisesIds: { id: number }[];
  visibility: "public" | "private";
}

export interface PlaylistCardDto extends PlaylistDTO {
  author: Session;
  cover: Image;
  likedByCurrentUser: boolean;
}

export interface PlaylistDetailDto extends PlaylistCardDto {
  likes: number;

  exercises: ExerciseCardDto[];
}
