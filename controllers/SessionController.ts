import { logger } from "@/lib/logger";
import type { Session } from "@/types/auth";
import { Controller, type ControllerDeps } from "./Controller";

export default class SessionController extends Controller<ControllerDeps> {
  async getSession(): Promise<Session | null> {
    try {
      const { user } = this.deps.context;
      if (!user) throw new Error("No user id in http cookie");

      const userData = await this.deps.client.user.findFirst({
        where: {
          id: user.id,
        },
      });

      if (!userData) throw new Error("User id could not be found in db");

      return {
        id: userData.id,
        profilePictureSource: userData.profilePicture,
        username: userData.username,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`Session request failed: ${message}`);
      return null;
    }
  }
}
