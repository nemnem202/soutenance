import FileController from "./controllers/FileController";
import { logger } from "./lib/logger";
import prismaClient from "./lib/prisma-client";

export async function setup() {
  return async () => {
    const controller = new FileController({ client: prismaClient, user: null });

    await controller.removeAllAfterTests();
    logger.info("Cloud has benn cleaned up.");
  };
}
