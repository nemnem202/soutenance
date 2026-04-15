import { PlaylistRepository } from "@/repositories/playlistRepository";
import { playlistSchema } from "@/schemas/entities.schema";
import type { Exercise, PlaylistSchema } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";

interface PlaylistControllerDeps extends ControllerDeps {
  userId: number;
}

export default class PlaylistController extends Controller<PlaylistControllerDeps> {
  private repository = new PlaylistRepository(this.deps.client);

  public async createPlaylist(playlist: PlaylistSchema) {
    const user = await this.deps.client.user.findUnique({
      where: {
        id: this.deps.userId,
      },
    });

    if (!user) throw new Error("User not found");

    const playlistValidation = playlistSchema.safeParse(playlist);

    if (!playlistValidation.success) {
      throw new Error(`Playlist invalide ${playlistValidation.error.message}`);
    }

    return await this.repository.create(playlist, this.deps.userId);
  }
  public addExerciseToPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public removeExerciseFromPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public changePlaylistVisibility(_playlistId: number) {}
  public removePlaylist(_playlistId: number) {}
}
