import type { PrismaClient } from "@/lib/generated/prisma/client";
import { usernameSchema } from "@/schemas/common.schema";
import type { Session } from "@/types/auth";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller } from "./Controller";
import UserRepository from "@/repositories/userRepository";

export default class UserController extends Controller<{ client: PrismaClient }> {
  private repository = new UserRepository(this.deps.client);
  async updateUsername(
    userId: number | null,
    newUsername: string
  ): Promise<ServerResponse<Session>> {
    if (!userId) return { success: false, status: Status.NotConnected, title: "Not connected" };

    const parse = usernameSchema.safeParse(newUsername);

    if (!parse.success) {
      const firstErrorMessage = parse.error.issues[0].message;

      return {
        success: false,
        status: Status.IncorrectLoginData,
        title: "Bad username",
        description: firstErrorMessage,
      };
    }

    const existingUser = await this.deps.client.user.findUnique({
      where: {
        username: newUsername,
      },
    });

    if (existingUser && existingUser.id !== userId)
      return {
        success: false,
        status: Status.ExistingUsername,
        title: "Username already exists",
        description: "Please choose another one",
      };

    const userData = await this.repository.updateUsername(userId, newUsername);

    if (!userData) {
      return {
        success: false,
        status: Status.UnknownError,
        title: "Account not found",
        description: "Try to reconnect",
      };
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
}
