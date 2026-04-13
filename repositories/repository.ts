import type { PrismaClient } from "@/lib/generated/prisma/client";

export abstract class Repository {
  constructor(protected client: PrismaClient) {}
}
