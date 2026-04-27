import { type ServerResponse, Status } from "@/types/server-response";
import { Controller } from "./Controller";
import { PlaylistCardDto } from "@/types/dtos/playlist";
import { AppError } from "@/lib/errors";
import { ExerciseCardDto } from "@/types/dtos/exercise";
import { UserCardDto } from "@/types/dtos/user";

export default class LikeController extends Controller {
  async userLikesPlaylist(playlistId: number): Promise<ServerResponse<{}>> {
    const userId = this.okUser();

    await this.client.playlist.update({
      where: { id: playlistId },
      data: {
        userLikesPlaylists: {
          connectOrCreate: {
            where: { userId_playlistId: { userId, playlistId } },
            create: { userId },
          },
        },
      },
    });

    return { success: true, status: Status.Ok, data: {} };
  }

  async userUnlikesPlaylist(playlistId: number): Promise<ServerResponse<{}>> {
    const userId = this.okUser();

    await this.client.playlist.update({
      where: { id: playlistId },
      data: {
        userLikesPlaylists: {
          deleteMany: { userId, playlistId },
        },
      },
    });

    return { success: true, status: Status.Ok, data: {} };
  }

  async userLikesExercise(exerciseId: number): Promise<ServerResponse<{}>> {
    const userId = this.okUser();

    await this.client.exercise.update({
      where: { id: exerciseId },
      data: {
        likedByUsers: {
          connectOrCreate: {
            where: { userId_exerciseId: { userId, exerciseId } },
            create: { userId },
          },
        },
      },
    });

    return { success: true, status: Status.Ok, data: {} };
  }

  async userUnlikesExercise(exerciseId: number): Promise<ServerResponse<{}>> {
    const userId = this.okUser();

    await this.client.exercise.update({
      where: { id: exerciseId },
      data: {
        likedByUsers: {
          deleteMany: { userId, exerciseId },
        },
      },
    });

    return { success: true, status: Status.Ok, data: {} };
  }

  async userLikesUser(likedUserId: number): Promise<ServerResponse<{}>> {
    const userId = this.okUser();

    await this.client.user.update({
      where: { id: likedUserId },
      data: {
        likedByUsers: {
          connectOrCreate: {
            where: { likedId_likingId: { likedId: likedUserId, likingId: userId } },
            create: { likingId: userId },
          },
        },
      },
    });

    return { success: true, status: Status.Ok, data: {} };
  }

  async userUnlikesUser(likedUserId: number): Promise<ServerResponse<{}>> {
    const userId = this.okUser();

    await this.client.user.update({
      where: { id: likedUserId },
      data: {
        likedByUsers: {
          deleteMany: { likedId: likedUserId, likingId: userId },
        },
      },
    });

    return { success: true, status: Status.Ok, data: {} };
  }

  async getPlaylists(): Promise<ServerResponse<PlaylistCardDto[]>> {
    const userId = this.okUser();

    const user = await this.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    const playlists = await this.client.playlist.findMany({
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

  async getExercises(): Promise<ServerResponse<ExerciseCardDto[]>> {
    const userId = this.okUser();

    const user = await this.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    const exercises = await this.client.exercise.findMany({
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

  async getUsers(): Promise<ServerResponse<UserCardDto[]>> {
    const userId = this.okUser();

    const user = await this.client.user.findUnique({ where: { id: userId } });

    if (!user) throw new AppError(Status.BadAuthMethod, "Unknown account", "Try to connect again.");

    const users = await this.client.user.findMany({
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
