import { logger } from "@/lib/logger";
import type { Session } from "@/types/auth";
import { Controller, type ControllerDeps } from "./Controller";

interface SessionDeps extends ControllerDeps {
  user: { id: number } | null;
}

export default class SessionController extends Controller<SessionDeps> {
  async getSession(): Promise<Session | null> {
    try {
      const { user } = this.deps;
      if (!user) throw new Error("No user id in http cookie");

      const userData = await this.deps.client.user.findFirst({
        where: {
          id: user.id,
        },
        include: {
          profilePicture: true,
        },
      });

      if (!userData) throw new Error("User id could not be found in db");

      logger.success("Session requested");
      logger.table(userData);

      return {
        id: userData.id,
        profilePictureSource: {
          alt: userData.profilePicture.alt,
          src: userData.profilePicture.url,
        },
        username: userData.username,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logger.error(`Session request failed: ${message}`);
      return null;
    }
  }
}
