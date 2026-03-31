import { env } from "./env";
import { PrismaClient } from "./generated/prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({ accelerateUrl: env.DATABASE_URL });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prismaGlobal: PrismaClientSingleton | undefined;
}
const prismaClient = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prismaClient;
}
