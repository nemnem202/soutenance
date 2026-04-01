import type { PrismaClient } from "@/lib/generated/prisma/client";

export interface ControllerDeps {
  client: PrismaClient;
}

export abstract class Controller<T extends ControllerDeps> {
  constructor(protected deps: T) {}
}
