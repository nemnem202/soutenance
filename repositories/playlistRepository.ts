import type { Playlist, PlaylistSchema } from "@/types/entities";
import { Repository } from "./repository";

export class PlaylistRepository extends Repository {
  async create(playlist: PlaylistSchema, userId: number): Promise<Playlist> {
    const playlistDb = await this.client.playlist.create({
      data: {
        title: playlist.title,
        description: playlist.description,
        visibility: playlist.visibility,
        author: { connect: { id: userId } },
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
            midifile: true,
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
}
