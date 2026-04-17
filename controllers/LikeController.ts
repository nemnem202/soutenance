import { type ServerResponse, Status } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import { AppError } from "@/lib/errors";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import type { UserCardDto } from "@/types/dtos/user";

export default class LikeController extends Controller<ControllerDeps> {
  async userLikesPlaylist(userId: number | null, playlistId: number): Promise<ServerResponse<{}>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    await this.deps.client.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        userLikesPlaylists: {
          connectOrCreate: {
            where: {
              userId_playlistId: {
                userId: user.id,
                playlistId: playlistId,
              },
            },
            create: {
              userId: user.id,
            },
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async userUnlikesPlaylist(
    userId: number | null,
    playlistId: number
  ): Promise<ServerResponse<{}>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    await this.deps.client.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        userLikesPlaylists: {
          deleteMany: {
            userId: user.id,
            playlistId: playlistId,
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async userLikesExercise(userId: number | null, exerciseId: number): Promise<ServerResponse<{}>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    await this.deps.client.exercise.update({
      where: {
        id: exerciseId,
      },
      data: {
        likedByUsers: {
          connectOrCreate: {
            where: {
              userId_exerciseId: {
                userId: user.id,
                exerciseId: exerciseId,
              },
            },
            create: {
              userId: user.id,
            },
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async userUnlikesExercise(
    userId: number | null,
    exerciseId: number
  ): Promise<ServerResponse<{}>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    await this.deps.client.exercise.update({
      where: {
        id: exerciseId,
      },
      data: {
        likedByUsers: {
          deleteMany: {
            userId: user.id,
            exerciseId: exerciseId,
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async userLikesUser(
    likingUserId: number | null,
    likedUserId: number
  ): Promise<ServerResponse<{}>> {
    if (!likingUserId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: likingUserId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    await this.deps.client.user.update({
      where: {
        id: likedUserId,
      },
      data: {
        likedByUsers: {
          connectOrCreate: {
            where: {
              likedId_likingId: {
                likedId: likedUserId,
                likingId: likingUserId,
              },
            },
            create: {
              likingId: user.id,
            },
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async userUnlikesUser(
    likingUserId: number | null,
    likedUserId: number
  ): Promise<ServerResponse<{}>> {
    if (!likingUserId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: likingUserId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    await this.deps.client.user.update({
      where: {
        id: likedUserId,
      },
      data: {
        likedByUsers: {
          deleteMany: {
            likedId: likedUserId,
            likingId: likingUserId,
          },
        },
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: {},
    };
  }

  async getPlaylists(userId: number | null): Promise<ServerResponse<PlaylistCardDto[]>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    const playlists = await this.deps.client.playlist.findMany({
      where: {
        userLikesPlaylists: {
          some: {
            userId: userId,
          },
        },
        visibility: "public",
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePicture: {
              select: {
                url: true,
                alt: true,
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
              select: { id: true },
            },
          },
        },
        title: true,
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: playlists.map((playlist) => ({
        author: playlist.author,
        cover: playlist.cover,
        exercises: playlist.includesExercises.map((include) => include.exercise),
        likedByCurrentUser: true,
        id: playlist.id,
        title: playlist.title,
        visibility: "public",
      })),
    };
  }

  async getExercises(userId: number | null): Promise<ServerResponse<ExerciseCardDto[]>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    const exercises = await this.deps.client.exercise.findMany({
      where: {
        likedByUsers: {
          some: {
            userId: userId,
          },
        },
        fromPlaylist: {
          visibility: "public",
        },
      },
      select: {
        id: true,
        title: true,
        composer: true,

        author: {
          select: {
            id: true,
            username: true,
            profilePicture: {
              select: {
                url: true,
                alt: true,
              },
            },
          },
        },
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
        chordsGrid: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            likedByUsers: true,
          },
        },
        midifile: true,
      },
    });

    return {
      success: true,
      status: Status.Ok,
      data: exercises.map((e) => ({
        author: e.author,
        id: e.id,
        title: e.title,
        composer: e.composer,
        originPlaylist: {
          ...e.fromPlaylist,
          exercises: e.fromPlaylist.includesExercises.map((include) => include.exercise),
        },
        cover: e.fromPlaylist.cover,
        defaultConfig: e.defaultConfig,
        chordsGrid: !!e.chordsGrid,
        inUserPlaylists: [],
        likedByCurrentUser: true,
        likes: e._count.likedByUsers,
        midifileUrl: !!e.midifile,
      })),
    };
  }

  async getUsers(userId: number | null): Promise<ServerResponse<UserCardDto[]>> {
    if (!userId) throw new AppError(Status.NotConnected, "You are not connected");

    const user = await this.deps.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    const users = await this.deps.client.user.findMany({
      where: {
        likedByUsers: {
          some: {
            likingUser: {
              id: userId,
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        profilePicture: {
          select: {
            url: true,
            alt: true,
          },
        },
      },
    });
    return {
      success: true,
      status: Status.Ok,
      data: users.map((e) => ({
        id: e.id,
        likedByCurrentUser: true,
        profilePicture: e.profilePicture,
        username: e.username,
      })),
    };
  }
}
