import type { PrismaClient } from "@/lib/generated/prisma/client";
import type { Telefunc } from "telefunc";

export interface ControllerDeps {
  client: PrismaClient;
  context: Telefunc.Context;
}

export abstract class Controller<T extends ControllerDeps> {
  constructor(protected deps: T) {}
}
