import { en, Faker } from "@faker-js/faker";
import type { Account, Exercise, Playlist } from "@/types/entities";

const faker = new Faker({ locale: [en] });

function generateAccount(): Account {
  return {
    id: faker.number.int(),
    firstName: faker.music.artist(),
    lastName: Math.random() > 0.5 ? faker.person.lastName() : undefined,
    picture: faker.image.avatar(),
  };
}

function generateExercise(accounts: Account[]): Exercise {
  const account = faker.helpers.arrayElement(accounts);
  return {
    id: faker.number.int(),
    title: faker.music.songName(),
    author: {
      id: account.id,
      profilePicture: {
        alt: "sdfsf",
        url: account.picture,
      },
      username: account.firstName,
    },
    defaultConfig: {
      bpm: faker.number.int({ min: 60, max: 200 }),
      groove: "Sqdqd",
      key: "A",
      timeSignatureBottom: 4,
      timeSignatureTop: 4,
    },
    chordsGrid: {
      sections: [],
    },
    composer: faker.person.fullName(),
    midifileUrl: "",
  };
}

function generatePlaylist(exercises: Exercise[], accounts: Account[]): Playlist {
  const nbExercises = faker.number.int({ min: 1, max: 5 });
  const selected = faker.helpers.arrayElements(exercises, nbExercises);
  const account = faker.helpers.arrayElement(accounts);

  return {
    id: faker.number.int(),
    author: {
      id: account.id,
      profilePicture: {
        alt: "sdfsf",
        url: account.picture,
      },
      username: account.firstName,
    },
    cover: {
      url: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
      alt: faker.lorem.words(3),
    },
    title: faker.music.album(),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.hacker.noun()),
    exercises: selected,
    description: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
    visibility: "public",
  };
}

export function generatePlaceholders() {
  const accounts = Array.from({ length: 20 }, generateAccount);

  const exercises = Array.from({ length: 100 }, () => generateExercise(accounts));

  const playlists = Array.from({ length: 20 }, () => generatePlaylist(exercises, accounts));

  return {
    accounts,
    exercises,
    playlists,
  };
}
