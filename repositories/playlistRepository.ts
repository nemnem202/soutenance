import type { PlaylistCardDto, PlaylistDetailDto } from "@/types/dtos/playlist";
import type { Playlist, PlaylistSchema } from "@/types/entities";
import { type ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";

export class PlaylistRepository extends Repository {
  async create(playlist: PlaylistSchema & { imageId?: string }, userId: number): Promise<Playlist> {
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
            cloudId: playlist.imageId,
          },
        },
      },
      include: {
        tags: true,
        cover: true,
        author: {
          omit: { createdAt: true, email: true, imageId: true, updatedAt: true },
          include: { profilePicture: true },
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

  async getSortedByPopularity(
    userId: number | null,
    start: number = 0,
    length: number = 20
  ): Promise<ServerResponse<PlaylistCardDto[]>> {
    const sliced = await this.client.playlist.findMany({
      where: { visibility: "public" },
      orderBy: { userLikesPlaylists: { _count: "desc" } },
      skip: start,
      take: length,
      include: {
        cover: true,
        includesExercises: {
          select: {
            exercise: { select: { id: true } },
          },
        },
        author: {
          include: { profilePicture: true },
          omit: { createdAt: true, updatedAt: true, email: true },
        },
        userLikesPlaylists: userId
          ? { where: { userId: userId }, select: { userId: true } }
          : false,
      },
    });

    return {
      status: Status.Ok,
      success: true,
      data: sliced.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercises: playlist.includesExercises.map((include) => include.exercise),
        visibility: playlist.visibility,
        likedByCurrentUser: (playlist as any).userLikesPlaylists?.length > 0,
      })),
    };
  }

  async getDiscover(
    userId: number | null,
    start: number = 0,
    length: number = 20
  ): Promise<ServerResponse<PlaylistCardDto[]>> {
    const playlistsIds = await this.client.$queryRaw<{ id: number }[]>`
      SELECT id FROM "Playlist"
      WHERE visibility = 'public'
      ORDER BY RANDOM()
      LIMIT ${length} OFFSET ${start}
    `;

    const ids = playlistsIds.map((p) => p.id);

    const sliced = await this.client.playlist.findMany({
      where: { id: { in: ids } },
      include: {
        cover: true,
        includesExercises: { select: { exercise: { select: { id: true } } } },
        author: {
          include: { profilePicture: true },
          omit: { createdAt: true, updatedAt: true, email: true },
        },
        userLikesPlaylists: userId
          ? { where: { userId: userId }, select: { userId: true } }
          : false,
      },
    });

    return {
      status: Status.Ok,
      success: true,
      data: sliced.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercises: playlist.includesExercises.map((include) => include.exercise),
        visibility: playlist.visibility,
        likedByCurrentUser: (playlist as any).userLikesPlaylists?.length > 0,
      })),
    };
  }

  async getUserPlaylists(userId: number): Promise<ServerResponse<PlaylistCardDto[]>> {
    const playlists = await this.client.playlist.findMany({
      where: { authorId: userId },
      include: {
        userLikesPlaylists: { where: { userId: userId }, select: { userId: true } },
        cover: true,
        includesExercises: { select: { exercise: { select: { id: true } } } },
        author: {
          include: { profilePicture: true },
          omit: { createdAt: true, updatedAt: true, email: true },
        },
      },
    });

    return {
      status: Status.Ok,
      success: true,
      data: playlists.map((playlist) => ({
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        exercises: playlist.includesExercises.map((include) => include.exercise),
        visibility: playlist.visibility,
        likedByCurrentUser: playlist.userLikesPlaylists.length > 0,
      })),
    };
  }

  async getSingleFromId(
    playlistId: number,
    userId: number | null,
    mustBePublic: boolean = true
  ): Promise<ServerResponse<PlaylistDetailDto>> {
    const playlist = await this.client.playlist.findUnique({
      where: {
        id: playlistId,
        visibility: mustBePublic ? "public" : { in: ["public", "private"] },
      },
      select: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        userLikesPlaylists: { where: { userId: userId ?? undefined }, select: { userId: true } },
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: {
              select: {
                alt: true,
                url: true,
              },
            },
          },
        },
        cover: {
          select: {
            url: true,
            alt: true,
          },
        },
        includesExercises: {
          select: {
            exercise: {
              select: {
                id: true,
                composer: true,
                likedByUsers: userId
                  ? { where: { userId: userId }, select: { userId: true } }
                  : false,
                author: {
                  select: {
                    id: true,
                    username: true,

                    profilePicture: {
                      select: {
                        alt: true,
                        url: true,
                      },
                    },
                  },
                },
                midifile: true,
                chordsGrid: true,
                fromPlaylist: {
                  select: {
                    cover: {
                      select: {
                        alt: true,
                        url: true,
                      },
                    },
                  },
                },
                defaultConfig: {
                  select: {
                    bpm: true,
                  },
                },
                title: true,
                _count: {
                  select: {
                    likedByUsers: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            userLikesPlaylists: true,
          },
        },
      },
    });

    if (!playlist) {
      return {
        status: Status.NotFound,
        success: false,
        title: "The playlist is either private or has been removed by its author.",
      };
    }

    return {
      status: Status.Ok,
      success: true,
      data: {
        id: playlist.id,
        title: playlist.title,
        author: playlist.author,
        cover: playlist.cover,
        likes: playlist._count.userLikesPlaylists,
        visibility: playlist.visibility,
        likedByCurrentUser: userId ? playlist.userLikesPlaylists?.length > 0 : false,
        exercises: playlist.includesExercises.map((includeExercise) => ({
          ...includeExercise.exercise,
          likes: includeExercise.exercise._count.likedByUsers,
          chordsGrid: !!includeExercise.exercise.chordsGrid,
          likedByCurrentUser: userId ? includeExercise.exercise.likedByUsers.length > 0 : false,
          inUserPlaylists: [],
          midifileUrl: !!includeExercise.exercise.midifile,
        })),
      },
    };
  }
}
