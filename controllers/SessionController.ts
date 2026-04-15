import type { PrismaClient } from "@/lib/generated/prisma/client";
import { PlaylistRepository } from "@/repositories/playlistRepository";
import type { Session } from "@/types/auth";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller } from "./Controller";

export default class SessionController extends Controller<{ client: PrismaClient }> {
  private playlistRepository = new PlaylistRepository(this.deps.client);

  async getSession(userId: number | null): Promise<ServerResponse<Session>> {
    if (!userId) return { success: false, title: "No session", status: Status.BadAuthMethod };

    const userData = await this.deps.client.user.findUnique({
      where: { id: userId },
      include: { profilePicture: true },
    });

    if (!userData) {
      return { success: false, title: "Invalid session", status: Status.BadAuthMethod };
    }

    return {
      success: true,
      status: Status.Ok,
      data: {
        id: userData.id,
        username: userData.username,
        profilePicture: {
          alt: userData.profilePicture.alt,
          url: userData.profilePicture.url,
        },
      },
    };
  }

  async getUserPlaylists(userId: number | null): Promise<ServerResponse<PlaylistCardDto[]>> {
    if (!userId) return { success: false, title: "No session", status: Status.BadAuthMethod };

    return await this.playlistRepository.getUserPlaylists(userId);
  }
}
