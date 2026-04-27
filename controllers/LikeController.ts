import { type ServerResponse, Status } from "@/types/server-response";
import { Controller } from "./Controller";

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
}
