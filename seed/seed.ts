import ExerciseController from "@/controllers/ExerciseController";
import PlaylistController from "@/controllers/PlaylistController";
import type { Playlist, User } from "@/lib/generated/prisma/client";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import type { ExerciseSchema, PlaylistSchema } from "@/types/entities";
import { faker } from "@faker-js/faker";
import seedTable from "./seed.json";

async function createUser(): Promise<User> {
  const username = faker.person.fullName();
  const email = `${username}@gmail.com`;
  const profilePicture = {
    create: {
      url: faker.image.avatar(),
      alt: `The profile picture of ${username}`,
    },
  };
  const userData = {
    username,
    email,
    profilePicture,
  };
  const user = await prismaClient.user.create({
    data: userData,
  });

  return user;
}

async function createPlaylist(
  playlist: PlaylistSchema,
  _userId: number,
  controller: PlaylistController
): Promise<Playlist> {
  const playlistDb = await controller.createPlaylist(playlist);
  return playlistDb;
}

async function fillPlaylist(
  userId: number,
  playlistId: number,
  exercises: ExerciseSchema[],
  _controller: PlaylistController
) {
  const exerciseController = new ExerciseController({ client: prismaClient, userId });
  const promises = exercises.map(
    (exercise) =>
      new Promise(() => {
        exerciseController.createExercise(exercise, playlistId);
      })
  );

  await Promise.all(promises);
}

async function putPlaylistInDb(playlist: PlaylistSchema) {
  const { id: userId } = await createUser();
  const controller = new PlaylistController({ client: prismaClient, userId });
  const { id: playlistId } = await createPlaylist(playlist, userId, controller);
  await fillPlaylist(userId, playlistId, playlist.exercises, controller);
}

async function createAll(playlists: PlaylistSchema[]) {
  const promises = playlists.map(
    (playlist) =>
      new Promise(() => {
        putPlaylistInDb(playlist);
      })
  );
  await Promise.all(promises);
}

async function seed() {
  try {
    logger.info("Seeding ...");
    await createAll(seedTable as PlaylistSchema[]);
    logger.success("Db is seeded.");
  } catch (err) {
    logger.error("Seed Error: ", err);
  }
}

seed();
