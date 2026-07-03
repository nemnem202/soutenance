import { faker } from "@faker-js/faker";
import ExerciseController from "@/controllers/ExerciseController";
import PlaylistController from "@/controllers/PlaylistController";
import type { User } from "@/lib/generated/prisma/client";
import prismaClient from "@/lib/prisma-client";
import { playlistSchema } from "@/schemas/entities.schema";
import type { ExerciseSchema, PlaylistSchema } from "@/types/entities";
import { IrealChartDecoder } from "./conversion/chart_decoder";
import { convertPlaylist } from "./conversion/converter";
import links from "./links.json";
import testLinks from "./test-links.json";
import { logger } from "@/lib/logger";

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

async function handleDuplicateExercise(
  exercise: ExerciseSchema,
  currentPlaylistExerciseCount: number
): Promise<{ shouldCreate: boolean }> {
  const existingExercise = await prismaClient.exercise.findFirst({
    where: {
      title: exercise.title,
      composer: exercise.composer,
    },
    include: {
      fromPlaylist: {
        include: {
          _count: {
            select: { createdExercises: true },
          },
        },
      },
    },
  });

  if (!existingExercise) {
    return { shouldCreate: true };
  }

  const existingPlaylistCount = existingExercise.fromPlaylist._count.createdExercises;

  if (currentPlaylistExerciseCount > existingPlaylistCount) {
    const oldPlaylistId = existingExercise.originPlaylistId;

    await prismaClient.exercise.delete({
      where: { id: existingExercise.id },
    });

    const remainingExercises = await prismaClient.exercise.count({
      where: { originPlaylistId: oldPlaylistId },
    });

    if (remainingExercises === 0) {
      await prismaClient.playlist.delete({
        where: { id: oldPlaylistId },
      });
      logger.info(`🗑️ Deleted empty playlist [ID: ${oldPlaylistId}] after duplicate removal.`);
    }

    logger.info(`♻️ Replaced duplicate: ${exercise.title} (New playlist is larger)`);
    return { shouldCreate: true };
  } else {
    logger.info(`⏭️ Skipped duplicate: ${exercise.title} (Existing playlist is larger or equal)`);
    return { shouldCreate: false };
  }
}

async function fillPlaylist(userId: number, playlistId: number, exercises: ExerciseSchema[]) {
  const exerciseController = new ExerciseController({
    client: prismaClient,
    user: { id: userId },
  });

  const currentPlaylistCount = exercises.length;

  for (const exercise of exercises) {
    try {
      const { shouldCreate } = await handleDuplicateExercise(exercise, currentPlaylistCount);

      if (shouldCreate) {
        await exerciseController.createExercise(exercise, playlistId);
      } else {
      }
    } catch (error) {
      logger.error(`Failed to process exercise ${exercise.title}:`, error);
    }
  }
}

async function putPlaylistInDb(playlist: PlaylistSchema, user: User) {
  const controller = new PlaylistController({
    client: prismaClient,
    user: { id: user.id },
  });

  const playlistDb = await controller.createPlaylistFromSeeding(playlist, user.id);

  await fillPlaylist(user.id, playlistDb.id, playlist.exercises);

  const exerciseCount = await prismaClient.exercise.count({
    where: { originPlaylistId: playlistDb.id },
  });

  if (exerciseCount === 0) {
    await prismaClient.playlist.delete({
      where: { id: playlistDb.id },
    });
    logger.info(
      `🗑️ Deleted current playlist "${playlist.title}" [ID: ${playlistDb.id}] because it contained only duplicate/inferior exercises.`
    );
    return null;
  }

  return playlistDb;
}

export default async function convertAllPlaylists(forTest?: "forTest") {
  const allLinks = forTest ? (testLinks as string[]) : (links as string[]);
  let fails = 0;
  let success = 0;

  logger.info("🚀 Starting Conversion...");

  let currentUser: User = await createUser();

  let currentUserPlaylistsLastBeforeCreateAnotherOne = Math.floor(Math.random() * 50) + 1;

  for (const [index, link] of allLinks.entries()) {
    try {
      currentUserPlaylistsLastBeforeCreateAnotherOne--;
      const irealPlaylist = new IrealChartDecoder(link);
      const converted = convertPlaylist(irealPlaylist);

      if (converted.failures.length > 0) {
        fails++;
        logger.info(`⚠️ [${index}] FAILED items in: ${irealPlaylist.title}`);
        forTest && logger.info(`Fail: `, converted.failures);
        continue;
      }

      const verifyPlaylist = playlistSchema.safeParse(converted.playlist);
      if (!verifyPlaylist.success) {
        fails++;
        logger.info(`❌ [${index}] VALIDATION ERROR: ${converted.playlist.title}`);
        forTest && logger.info(`Fail: `, verifyPlaylist.error);
        continue;
      }

      if (currentUserPlaylistsLastBeforeCreateAnotherOne <= 0) {
        currentUserPlaylistsLastBeforeCreateAnotherOne = Math.floor(Math.random() * 50) + 1;
        currentUser = await createUser();
      }
      await putPlaylistInDb(converted.playlist, currentUser);

      success++;
      logger.info(
        `✅ [${index}] Seeded: ${converted.playlist.title} (${converted.playlist.exercises.length} songs)`
      );
    } catch (err) {
      fails++;
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error(`🔥 [${index}] CRITICAL ERROR: ${msg}`);
    }
  }

  logger.info("-----------------------------------------");
  logger.info(`🏁 CONVERSION ENDED | Success: ${success} | Failed: ${fails}`);
}
