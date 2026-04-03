import type { Session } from "@/types/auth";
import { Controller } from "./Controller";
import type { PrismaClient } from "@/lib/generated/prisma/client";

export default class SessionController extends Controller<{ client: PrismaClient }> {
  async getSession(userId: number | null): Promise<Session | null> {
    if (!userId) return null;

    const userData = await this.deps.client.user.findUnique({
      where: { id: userId },
      include: { profilePicture: true },
    });

    if (!userData) {
      return null;
    }

    return {
      id: userData.id,
      username: userData.username,
      profilePictureSource: {
        alt: userData.profilePicture.alt,
        src: userData.profilePicture.url,
      },
    };
  }
}
