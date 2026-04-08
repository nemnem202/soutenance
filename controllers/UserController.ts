import { PrismaClient } from "@/lib/generated/prisma/client";
import { Controller } from "./Controller";
import { Session } from "@/types/auth";
import { usernameSchema } from "@/schemas/common.schema";

export default class UserController extends Controller<{ client: PrismaClient }> {
  async updateUsername(userId: number | null, newUsername: string): Promise<Session | null> {
    if (!userId) return null;

    usernameSchema.parse(newUsername);

    const existingUser = await this.deps.client.user.findUnique({
      where: {
        username: newUsername,
      },
    });

    if (existingUser && existingUser.id !== userId)
      throw new Error("This username already exists, please choose another one.");

    const userData = await this.deps.client.user.update({
      where: { id: userId },
      data: {
        username: newUsername,
      },
      include: {
        profilePicture: true,
      },
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
