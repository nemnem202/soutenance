import type { Session } from "../auth";
import type { PlaylistCardDto } from "./playlist";

export interface UserCardDto extends Session {
  likedByCurrentUser: boolean;
}

export interface UserDetailsDto extends UserCardDto {
  publicPlaylists: PlaylistCardDto[];
}
