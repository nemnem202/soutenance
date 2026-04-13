import type { Session } from "../auth";
import type { Image } from "../entities";
import type { ExerciseCardDto } from "./exercise";

export interface PlaylistDTO {
  id: number;
  title: string;
  authorId: number;
  exercisesIds: { id: number }[];
  visibility: "public" | "private";
}

export interface PlaylistCardDto extends PlaylistDTO {
  author: Session;
  cover: Image;
}

export interface PlaylistDetailDto extends PlaylistDTO {
  author: Session;
  cover: Image;
  likes: number;
  likedByCurrentUser: boolean;
  exercises: ExerciseCardDto[];
}
