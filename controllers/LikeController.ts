import { ServerResponse, Status } from "@/types/server-response";
import { Controller, ControllerDeps } from "./Controller";
import { AppError } from "@/lib/errors";

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
}
