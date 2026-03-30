import type { Account, Exercise, Playlist } from "@/types/entities";
import { Faker, en } from "@faker-js/faker";

const faker = new Faker({ locale: [en] });

function generateAccount(): Account {
  return {
    id: faker.string.uuid(),
    firstName: faker.music.artist(),
    lastName: Math.random() > 0.5 ? faker.person.lastName() : undefined,
    picture: faker.image.avatar(),
  };
}

function generateExercise(accounts: Account[]): Exercise {
  return {
    id: faker.string.uuid(),
    title: faker.music.songName(),
    account: faker.helpers.arrayElement(accounts),
    author: faker.person.firstName(),
    config: {
      bpm: faker.number.int({ min: 60, max: 200 }),
    },
    creation: faker.date.anytime(),
    hasChords: faker.datatype.boolean(),
    hasMelody: faker.datatype.boolean(),
    midiFileId: faker.string.uuid(),
  };
}

function generatePlaylist(
  exercises: Exercise[],
  accounts: Account[],
): Playlist {
  const nbExercises = faker.number.int({ min: 1, max: 5 });
  const selected = faker.helpers.arrayElements(exercises, nbExercises);

  return {
    id: faker.string.uuid(),
    author: faker.person.firstName() + faker.person.lastName(),
    accountId: faker.helpers.arrayElement(accounts).id,
    image: {
      src: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
      alt: faker.lorem.words(3),
    },
    title: faker.music.album(),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.hacker.noun(),
    ),
    exercisesIds: selected.map((e) => e.id),
    description: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    visibility: "public",
  };
}

export function generatePlaceholders() {
  const accounts = Array.from({ length: 20 }, generateAccount);

  const exercises = Array.from({ length: 100 }, () =>
    generateExercise(accounts),
  );

  const playlists = Array.from({ length: 20 }, () =>
    generatePlaylist(exercises, accounts),
  );

  return {
    accounts,
    exercises,
    playlists,
  };
}
