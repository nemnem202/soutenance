import { faker } from "@faker-js/faker";
import ExerciseController from "@/controllers/ExerciseController";
import PlaylistController from "@/controllers/PlaylistController";
import type { User } from "@/lib/generated/prisma/client";
import { logger } from "@/lib/logger";
import prismaClient from "@/lib/prisma-client";
import type { ExerciseSchema, Playlist, PlaylistSchema } from "@/types/entities";
import links from "./links.json";
import { IrealChartDecoder } from "./conversion/chart_decoder";
import { convertPlaylist } from "./conversion/converter";
import { playlistSchema } from "@/schemas/entities.schema";

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

export default async function convertAllPlaylists() {
  const allLinks = links as string[];
  let fails = 0;
  const successPlaylists: PlaylistSchema[] = [];
  const failedPlaylists: PlaylistSchema[] = [];

  console.log("Starting Conversion...");
  allLinks.forEach((link, index) => {
    try {
      const irealPlaylist = new IrealChartDecoder(link);
      const converted = convertPlaylist(irealPlaylist);
      if (converted.failures.length > 0) {
        fails++;
        failedPlaylists.push(converted.playlist);
        console.log("FAILED", index);
        return;
      }
      const verifiyPlaylist = playlistSchema.safeParse(converted.playlist);
      if (!verifiyPlaylist.success) {
        throw new Error(`Critical Fail: ${verifiyPlaylist.error}`);
      }
      putPlaylistInDb(converted.playlist);
      successPlaylists.push(converted.playlist);
    } catch (err) {
      fails++;
      console.log("ERROR", index);
      console.error(err);
    }
  });

  console.log("CONVERSION ENDED");
  console.log("Success: ", successPlaylists.length, "Failed", fails);
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
