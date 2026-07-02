import { logger } from "@/lib/logger";
import convertAllPlaylists from "./functions";

async function seed() {
  try {
    logger.info("Seeding ...");
    await convertAllPlaylists();
    logger.success("Db is seeded.");
  } catch (err) {
    logger.error("Seed Error: ", err);
  }
}
seed();
