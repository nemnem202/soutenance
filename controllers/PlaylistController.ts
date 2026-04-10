import type { Exercise, Playlist, PlaylistSchema } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";

interface PlaylistControllerDeps extends ControllerDeps {
  userId: number;
}

export default class PlaylistController extends Controller<PlaylistControllerDeps> {
  public createPlaylist(_playlist: PlaylistSchema): Promise<Playlist> {}
  public addExerciseToPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public removeExerciseFromPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public changePlaylistVisibility(_playlistId: number) {}
  public removePlaylist(_playlistId: number) {}
}
