import { Session } from "../auth";
import { PlaylistCardDto } from "./playlist";

export interface UserDetailsDto extends Session {
  publicPlaylists: PlaylistCardDto[];
}
