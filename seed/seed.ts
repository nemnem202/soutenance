import { faker } from "@faker-js/faker";
import ExerciseController from "@/controllers/ExerciseController";
import PlaylistController from "@/controllers/PlaylistController";
import type { User } from "@/lib/generated/prisma/client";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import { playlistSchema } from "@/schemas/entities.schema";
import type { ExerciseSchema, Playlist, PlaylistSchema } from "@/types/entities";
import { IrealChartDecoder } from "./conversion/chart_decoder";
import { convertPlaylist } from "./conversion/converter";
import links from "./links.json";

async function createUser(): Promise<User> {
  const baseUsername = faker.person.firstName().substring(0, 20);
  let currentUsername = baseUsername;
  let counter = 0;
  while (true) {
    const existingUser = await prismaClient.user.findUnique({
      where: { username: currentUsername },
      select: { id: true },
    });

    if (!existingUser) {
      break;
    }
    currentUsername = `${baseUsername.substring(0, 20 - 1 - String(counter).length)}_${counter}`;
    counter++;
  }

  const email = `${currentUsername + crypto.randomUUID()}@gmail.com`;

  const profilePicture = {
    create: {
      url: faker.image.avatar(),
      alt: `The profile picture of ${currentUsername}`,
    },
  };

  const userData = {
    username: currentUsername,
    email,
    profilePicture,
  };

  const user = await prismaClient.user.create({
    data: userData,
  });

  return user;
}

async function _createPlaylist(
  playlist: PlaylistSchema,
  controller: PlaylistController
): Promise<Playlist> {
  const playlistDb = await controller.createPlaylist(playlist);
  return playlistDb;
}

async function fillPlaylist(userId: number, playlistId: number, exercises: ExerciseSchema[]) {
  const exerciseController = new ExerciseController({ client: prismaClient, userId });
  const promises = exercises.map((exercise) =>
    exerciseController.createExercise(exercise, playlistId)
  );

  await Promise.all(promises);
}

async function putPlaylistInDb(playlist: PlaylistSchema, user: User) {
  const controller = new PlaylistController({ client: prismaClient, userId: user.id });
  const playlistDb = await controller.createPlaylist(playlist);

  await fillPlaylist(user.id, playlistDb.id, playlist.exercises);
}

export default async function convertAllPlaylists() {
  const allLinks = links as string[];
  let fails = 0;
  let success = 0;

  console.log("🚀 Starting Conversion...");

  let currentUser: User = await createUser();

  let currentUserPlaylistsLastBeforeCreateAnotherOne = Math.floor(Math.random() * 50) + 1;

  for (const [index, link] of allLinks.entries()) {
    try {
      currentUserPlaylistsLastBeforeCreateAnotherOne--;
      const irealPlaylist = new IrealChartDecoder(link);
      const converted = convertPlaylist(irealPlaylist);

      if (converted.failures.length > 0) {
        fails++;
        console.log(`⚠️ [${index}] FAILED items in: ${irealPlaylist.title}`);
        continue;
      }

      const verifyPlaylist = playlistSchema.safeParse(converted.playlist);
      if (!verifyPlaylist.success) {
        fails++;
        console.log(`❌ [${index}] VALIDATION ERROR: ${converted.playlist.title}`);

        continue;
      }

      if (currentUserPlaylistsLastBeforeCreateAnotherOne <= 0) {
        currentUserPlaylistsLastBeforeCreateAnotherOne = Math.floor(Math.random() * 50) + 1;
        currentUser = await createUser();
      }
      await putPlaylistInDb(converted.playlist, currentUser);

      success++;
      console.log(
        `✅ [${index}] Seeded: ${converted.playlist.title} (${converted.playlist.exercises.length} songs)`
      );
    } catch (err) {
      fails++;
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error(`🔥 [${index}] CRITICAL ERROR: ${msg}`);
    }
  }

  console.log("-----------------------------------------");
  console.log(`🏁 CONVERSION ENDED | Success: ${success} | Failed: ${fails}`);
}

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
