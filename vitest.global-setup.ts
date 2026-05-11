import prismaClient from "./lib/prisma-client";
import convertAllPlaylists from "./seed/functions";
import FileController from "./controllers/FileController";
import { logger } from "./lib/logger";

export async function setup() {
  console.log("\n🚀 Starting Global Setup...");

  await prismaClient.$transaction([
    prismaClient.playlistIncludesExercise.deleteMany(),
    prismaClient.userLikesPlaylist.deleteMany(),
    prismaClient.userLikesExercise.deleteMany(),
    prismaClient.userLikesUser.deleteMany(),
    prismaClient.exercise.deleteMany(),
    prismaClient.playlist.deleteMany(),
    prismaClient.user.deleteMany(),
  ]);
  logger.info("✅ Database cleaned.");

  try {
    await convertAllPlaylists("forTest");
    logger.info("✅ Database seeded for tests.");
  } catch (error) {
    logger.error("❌ Seeding failed during global setup", error);
    process.exit(1);
  }

  return async () => {
    console.log("\n🧹 Starting Global Teardown...");
    const fileCtrl = new FileController({ client: prismaClient, user: null });
    await fileCtrl.removeAllAfterTests();
    await prismaClient.$disconnect();
    logger.info("✅ Cloudinary cleaned and DB disconnected.");
  };
}
