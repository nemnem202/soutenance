import UserRepository from "@/repositories/userRepository";
import { usernameSchema } from "@/schemas/common.schema";
import type { Session } from "@/types/auth";
import { type ServerResponse, Status } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import { AppError } from "@/lib/errors";

export default class UserController extends Controller {
  private repository: UserRepository;

  constructor(deps: ControllerDeps) {
    super(deps);
    this.repository = new UserRepository(this.client);
  }

  async updateUsername(newUsername: string): Promise<ServerResponse<Session>> {
    const userId = this.okUser();
    const parse = usernameSchema.safeParse(newUsername);

    if (!parse.success) {
      throw new AppError(
        Status.IncorrectLoginData,
        "Nom d'utilisateur invalide",
        parse.error.issues[0].message
      );
    }

    const existingUser = await this.client.user.findUnique({ where: { username: newUsername } });
    if (existingUser && existingUser.id !== userId) {
      throw new AppError(Status.ExistingUsername, "Nom d'utilisateur déjà pris");
    }

    const userData = await this.repository.updateUsername(userId, newUsername);

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
}
