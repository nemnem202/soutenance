import type { Session } from "../auth";
import type { Image } from "../entities";
import type { PlaylistDTO } from "./playlist";

export interface ExerciseDto {
  id: number;
  author: Session;
  title: string;
}

export interface ExerciseCardDto extends ExerciseDto {
  composer: string;
  description?: string;
  likes: number;
  likedByCurrentUser: boolean;
  inUserPlaylists: PlaylistDTO[];
  chordsGrid: boolean;
  midifileUrl: boolean;
  defaultConfig: {
    bpm: number;
  };
}

export interface SoloExerciseCardDto extends ExerciseCardDto {
  cover: Image;
}
