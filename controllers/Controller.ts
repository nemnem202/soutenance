import type { PrismaClient } from "@/lib/generated/prisma/client";
import { AppError } from "@/lib/errors";
import { Status } from "@/types/server-response";

export interface UserContext {
  id: number;
}

export interface ControllerDeps {
  client: PrismaClient;
  user: UserContext | null;
}

export abstract class Controller {
  protected client: PrismaClient;
  protected user: UserContext | null;

  constructor(deps: ControllerDeps) {
    this.client = deps.client;
    this.user = deps.user;
  }

  /**
   * Garantit que l'utilisateur est authentifié et retourne son ID.
   * Lève une AppError sinon.
   */
  protected okUser(): number {
    if (!this.user?.id) {
      throw new AppError(
        Status.NotConnected,
        "Authentification requise",
        "Vous devez être connecté pour effectuer cette action."
      );
    }
    return this.user.id;
  }

  /**
   * Vérifie si l'utilisateur actuel est le propriétaire d'une ressource.
   */
  protected isOwner(ownerId: number): boolean {
    return this.user?.id === ownerId;
  }
}
