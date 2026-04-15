import type { Session } from "../auth";
import type { PlaylistCardDto } from "./playlist";

export interface UserDetailsDto extends Session {
  publicPlaylists: PlaylistCardDto[];
}
