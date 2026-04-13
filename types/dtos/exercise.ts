import type { Session } from "../auth";
import type { PlaylistDTO } from "./playlist";

export interface ExerciseDto {
  id: number;
  author: Session;
  title: string;
}

export interface ExerciseCardDto extends ExerciseDto {
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
