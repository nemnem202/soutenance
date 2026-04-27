import { PlaylistRepository } from "@/repositories/playlistRepository";
import type { Session } from "@/types/auth";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller } from "./Controller";
import { AppError } from "@/lib/errors";

export default class SessionController extends Controller {
  private playlistRepository = new PlaylistRepository(this.client);

  async getSession(): Promise<ServerResponse<Session>> {
    const userId = this.okUser();
    const userData = await this.client.user.findUnique({
      where: { id: userId },
      include: { profilePicture: true },
    });

    if (!userData) {
      throw new AppError(
        Status.BadAuthMethod,
        "Session invalide",
        "Utilisateur non trouvé dans la base de données."
      );
    }

    return {
      success: true,
      status: Status.Ok,
      data: {
        id: userData.id,
        username: userData.username,
        profilePicture: userData.profilePicture,
      },
    };
  }

  async getUserPlaylists(): Promise<ServerResponse<PlaylistCardDto[]>> {
    const userId = this.okUser();
    return await this.playlistRepository.getUserPlaylists(userId);
  }
}
