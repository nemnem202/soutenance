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
  likes: number;
  likedByCurrentUser: boolean;
  inUserPlaylists: PlaylistDTO[];
  originPlaylist: PlaylistDTO;
  chordsGrid: boolean;
  midifileUrl: boolean;
  cover: Image;
  defaultConfig: {
    bpm: number;
  };
}
