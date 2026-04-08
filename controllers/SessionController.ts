import type { PrismaClient } from "@/lib/generated/prisma/client";
import type { Session } from "@/types/auth";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller } from "./Controller";

export default class SessionController extends Controller<{ client: PrismaClient }> {
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
        profilePictureSource: {
          alt: userData.profilePicture.alt,
          src: userData.profilePicture.url,
        },
      },
    };
  }
}
