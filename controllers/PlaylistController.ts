import { PlaylistRepository } from "@/repositories/playlistRepository";
import { playlistSchema } from "@/schemas/entities.schema";
import type { Exercise, PlaylistSchema } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";
import { PlaylistRegisterData } from "@/types/playlist";
import { ServerResponse, Status } from "@/types/server-response";
import { playlistRegisterSchema } from "@/schemas/auth.schema";
import { AppError } from "@/lib/errors";
import FileController from "./FileController";

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

  public async createPlaylistFromUser(
    playlistData: PlaylistRegisterData
  ): Promise<ServerResponse<{}>> {
    const playlistValidation = playlistRegisterSchema.safeParse(playlistData);
    if (!playlistValidation.success) {
      throw new AppError(
        Status.IncorrectRegisterData,
        "Formulaire invalide",
        playlistValidation.error.message
      );
    }

    const { cover, tags, title, visibility, description } = playlistData;

    const fileController = new FileController({
      client: this.deps.client,
      file: cover.file as File,
    });
    const imageUpload = await fileController.uploadFileAsImage();

    const user = await this.repository.create(
      {
        cover: {
          alt: cover.alt,
          url: imageUpload.url,
        },
        imageId: imageUpload.imageId,
        exercises: [],
        tags: tags,
        title: title,
        visibility: visibility,
        description: description ?? undefined,
      },
      this.deps.userId
    );

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  public addExerciseToPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public removeExerciseFromPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public changePlaylistVisibility(_playlistId: number) {}
  public removePlaylist(_playlistId: number) {}
}
