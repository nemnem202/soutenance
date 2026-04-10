import { playlistSchema } from "@/schemas/entities.schema";
import type { Exercise, Playlist, PlaylistSchema } from "@/types/entities";
import { Controller, type ControllerDeps } from "./Controller";

interface PlaylistControllerDeps extends ControllerDeps {
  userId: number;
}

export default class PlaylistController extends Controller<PlaylistControllerDeps> {
  public async createPlaylist(playlist: PlaylistSchema): Promise<Playlist> {
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
    const playlistDb = await this.deps.client.playlist.create({
      data: {
        title: playlist.title,
        description: playlist.description,
        visibility: playlist.visibility, // "public" ou "private" correspond déjà à l'enum
        author: { connect: { id: this.deps.userId } },
        cover: {
          create: {
            alt: playlist.cover.alt,
            url: playlist.cover.url,
          },
        },
      },
      include: {
        tags: true,
        cover: true,
        exercises: {
          include: {
            defaultConfig: true,
            midifile: true, // <--- AJOUTÉ : Indispensable pour midifileUrl
            chordsGrid: {
              include: {
                sections: {
                  include: {
                    commonMeasures: true,
                    voltas: true,
                  },
                },
              },
            },
          },
        },
        author: {
          omit: {
            createdAt: true,
            email: true,
            imageId: true,
            updatedAt: true,
          },
          include: {
            profilePicture: true,
          },
        },
      },
    });

    return {
      id: playlistDb.id,
      author: playlistDb.author,
      title: playlistDb.title,
      description: playlistDb.description ?? undefined,
      visibility: playlistDb.visibility,
      tags: playlistDb.tags.map((t) => t.label),
      cover: {
        url: playlistDb.cover.url,
        alt: playlistDb.cover.alt,
      },
      exercises: [],
    };
  }
  public addExerciseToPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public removeExerciseFromPlaylist(_exercise: Exercise, _playlist_id: number) {}
  public changePlaylistVisibility(_playlistId: number) {}
  public removePlaylist(_playlistId: number) {}
}
