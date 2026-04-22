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
    userId: number | null
  ): Promise<ServerResponse<PlaylistDetailDto>> {
    const playlist = await this.client.playlist.findUnique({
      where: {
        id: playlistId,
        OR: [{ visibility: "public" }, userId ? { visibility: "private", authorId: userId } : {}],
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
                    id: true,
                    visibility: true,
                    title: true,
                    includesExercises: { select: { exercise: { select: { id: true } } } },
                    cover: {
                      select: {
                        url: true,
                        alt: true,
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
          cover: includeExercise.exercise.fromPlaylist.cover,
          originPlaylist: {
            ...includeExercise.exercise.fromPlaylist,
            exercises: includeExercise.exercise.fromPlaylist.includesExercises.map(
              (include) => include.exercise
            ),
          },
        })),
      },
    };
  }

  async addPlaylistToPlaylist(
    targetPlaylistId: number,
    playlistToAddId: number,
    userId: number
  ): Promise<ServerResponse<null>> {
    const exercisesIds = await this.client.exercise.findMany({
      where: {
        inPlaylists: {
          some: {
            playlistId: playlistToAddId,
          },
        },
        OR: [
          {
            fromPlaylist: {
              visibility: "public",
            },
          },
          userId
            ? {
                fromPlaylist: {
                  visibility: "private",
                  authorId: userId,
                },
              }
            : {},
        ],
      },
      select: {
        id: true,
      },
    });

    await this.client.playlist.update({
      where: {
        id: targetPlaylistId,
        authorId: userId,
      },
      data: {
        includesExercises: {
          connectOrCreate: exercisesIds.map((e) => ({
            where: {
              exerciseId_playlistId: {
                playlistId: targetPlaylistId,
                exerciseId: e.id,
              },
            },
            create: {
              exerciseId: e.id,
            },
          })),
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: null,
    };
  }

  async addExerciseToPlaylist(
    targetPlaylistId: number,
    exerciseToAddId: number,
    userId: number
  ): Promise<ServerResponse<null>> {
    const exercise = await this.client.exercise.findUnique({
      where: {
        OR: [
          {
            fromPlaylist: {
              visibility: "public",
            },
          },
          userId
            ? {
                fromPlaylist: {
                  visibility: "private",
                  authorId: userId,
                },
              }
            : {},
        ],
        id: exerciseToAddId,
      },
      select: {
        id: true,
      },
    });

    if (!exercise)
      return {
        success: false,
        status: Status.NotFound,
        title: "Cannot add this exercise to the playlist",
        description: "This can happen because the exercise come from a private playlist",
      };

    await this.client.playlist.update({
      where: {
        id: targetPlaylistId,
        authorId: userId,
      },
      data: {
        includesExercises: {
          connectOrCreate: {
            where: {
              exerciseId_playlistId: {
                playlistId: targetPlaylistId,
                exerciseId: exercise.id,
              },
            },
            create: {
              exerciseId: exercise.id,
            },
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: null,
    };
  }

  async addManyExercisesToPlaylist(
    targetPlaylistId: number,
    exercisesToAddIds: number[],
    userId: number
  ): Promise<ServerResponse<null>> {
    const exercises = await Promise.all(
      exercisesToAddIds.map((exerciseId) =>
        this.client.exercise.findUnique({
          where: {
            id: exerciseId,
            OR: [
              { fromPlaylist: { visibility: "public" } },
              { fromPlaylist: { visibility: "private", authorId: userId } },
            ],
          },
          select: { id: true },
        })
      )
    );

    const validExercises = exercises.filter((e): e is { id: number } => e !== null);

    if (validExercises.length > 0) {
      await this.client.playlist.update({
        where: {
          id: targetPlaylistId,
          authorId: userId,
        },
        data: {
          includesExercises: {
            connectOrCreate: validExercises.map((exercise) => ({
              where: {
                exerciseId_playlistId: {
                  playlistId: targetPlaylistId,
                  exerciseId: exercise.id,
                },
              },
              create: {
                exerciseId: exercise.id,
              },
            })),
          },
        },
      });
    }

    return {
      success: true,
      status: Status.Ok,
      data: null,
    };
  }

  async removeExerciseFromPlaylist(
    targetPlaylistId: number,
    exerciseToRemoveId: number,
    userId: number
  ): Promise<ServerResponse<null>> {
    await this.client.playlist.update({
      where: {
        authorId: userId,
        id: targetPlaylistId,
      },
      data: {
        includesExercises: {
          deleteMany: {
            exerciseId: exerciseToRemoveId,
          },
        },
        createdExercises: {
          deleteMany: {
            id: exerciseToRemoveId,
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: null,
    };
  }

  async removePlaylist(playlistId: number, userId: number): Promise<ServerResponse<null>> {
    await this.client.playlist.delete({
      where: {
        author: {
          id: userId,
        },
        id: playlistId,
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: null,
    };
  }

  async getRecent(
    userId: number | null,
    start: number = 0,
    length: number = 20
  ): Promise<ServerResponse<PlaylistCardDto[]>> {
    if (!userId)
      return {
        success: false,
        status: Status.NotConnected,
        title: "Try to connect",
      };

    const sliced = await this.client.playlist.findMany({
      where: {
        visibility: "public",
        userLikesPlaylists: {
          every: {
            userId: userId,
          },
        },
      },
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
}
