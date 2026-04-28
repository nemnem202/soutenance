import { PlaylistRepository } from "@/repositories/playlistRepository";
import { playlistRegisterSchema } from "@/schemas/auth.schema";
import type { PlaylistRegisterData } from "@/types/playlist";
import { type ServerResponse, Status } from "@/types/server-response";
import { AppError } from "@/lib/errors";
import { Controller } from "./Controller";
import FileController from "./FileController";
import { PlaylistSchema } from "@/types/entities";
import { playlistSchema } from "@/schemas/entities.schema";

export default class PlaylistController extends Controller {
  private repository = new PlaylistRepository(this.client);

  async createPlaylistFromUser(playlistData: PlaylistRegisterData): Promise<ServerResponse<{}>> {
    const userId = this.okUser();
    const validation = playlistRegisterSchema.safeParse(playlistData);

    if (!validation.success) {
      throw new AppError(
        Status.IncorrectRegisterData,
        "Données invalides",
        validation.error.message
      );
    }

    const { cover, tags, title, visibility, description } = playlistData;

    const fileController = new FileController({
      client: this.client,
      user: this.user,
      file: cover.file as File,
    });

    const imageUpload = await fileController.uploadFileAsImage();

    await this.repository.create(
      {
        cover: { alt: cover.alt, url: imageUpload.url },
        imageId: imageUpload.imageId,
        exercises: [],
        tags: tags,
        title: title,
        visibility: visibility,
        description: description ?? undefined,
      },
      userId
    );

    return { success: true, status: Status.Ok, data: {} };
  }

  async createPlaylistFromSeeding(playlistData: PlaylistSchema, userId: number) {
    const user = await this.client.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User not found");

    const playlistValidation = playlistSchema.safeParse(playlistData);

    if (!playlistValidation.success) {
      throw new Error(`Playlist invalide ${playlistValidation.error.message}`);
    }

    return await this.repository.create(playlistData, userId);
  }

  async removePlaylist(playlistId: number): Promise<ServerResponse<null>> {
    const userId = this.okUser();
    return await this.repository.removePlaylist(playlistId, userId);
  }

  async addPlaylistToPlaylist(
    targetPlaylistId: number,
    playlistToAddId: number
  ): Promise<ServerResponse<null>> {
    const userId = this.okUser();

    return await this.repository.addPlaylistToPlaylist(targetPlaylistId, playlistToAddId, userId);
  }

  async addExerciseToPlaylist(
    targetPlaylistId: number,
    exerciseToAddId: number
  ): Promise<ServerResponse<null>> {
    const userId = this.okUser();
    return await this.repository.addExerciseToPlaylist(targetPlaylistId, exerciseToAddId, userId);
  }

  async addManyExercisesToPlaylist(
    targetPlaylistId: number,
    exercisesToAddIds: number[]
  ): Promise<ServerResponse<null>> {
    const userId = this.okUser();
    return await this.repository.addManyExercisesToPlaylist(
      targetPlaylistId,
      exercisesToAddIds,
      userId
    );
  }

  async removeExerciseFromPlaylist(
    targetPlaylistId: number,
    exerciseToRemoveId: number
  ): Promise<ServerResponse<null>> {
    const userId = this.okUser();
    return await this.repository.removeExerciseFromPlaylist(
      targetPlaylistId,
      exerciseToRemoveId,
      userId
    );
  }
}
