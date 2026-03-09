import { Account } from "@/types/account";
import { Exercice, Playlist } from "@/types/project";
import { Faker, en } from "@faker-js/faker";

const faker = new Faker({ locale: [en] });

const generateAccount = (): Account => ({
  id: faker.string.uuid(),
  firstName: faker.music.artist(),
  lastName: Math.random() > 0.5 ? faker.person.lastName() : undefined,
  picture: faker.image.avatar(),
});

const ACCOUNTS_PLACEHOLDER: Account[] = Array.from({ length: 20 }, () => generateAccount());

const generateExercice = (): Exercice => ({
  id: faker.string.uuid(),
  title: faker.music.songName(),
  account: faker.helpers.arrayElement(ACCOUNTS_PLACEHOLDER),
  author: faker.person.firstName(),
  config: {
    bpm: faker.number.int({ min: 60, max: 200 }),
  },
  creation: faker.date.anytime(),
  hasChords: faker.datatype.boolean(),
  haseMelody: faker.datatype.boolean(),
  midiFileId: faker.string.uuid(),
});

const generatePlaylist = (exercices: Exercice[]): Playlist => {
  const nbExercices = faker.number.int({ min: 1, max: 5 });
  const selectedExercices = faker.helpers.arrayElements(exercices, nbExercices);
  return {
    id: faker.string.uuid(),
    author: faker.person.firstName() + faker.person.lastName(),
    accountId: faker.helpers.arrayElement(ACCOUNTS_PLACEHOLDER).id,
    image: {
      src: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
      alt: faker.lorem.words(3),
    },
    title: faker.music.album(),
    tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.hacker.noun()),
    exercicesIds: selectedExercices.map((ex) => ex.id),
    description: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
  };
};

const EXERCICES_PLACEHOLDER: Exercice[] = Array.from({ length: 2000 }, () => generateExercice());

const PROJECTS_PLACEHOLDERS: Playlist[] = Array.from({ length: 200 }, () => generatePlaylist(EXERCICES_PLACEHOLDER));

export function getRandomPlaylist(): Playlist {
  const randomIndex = Math.floor(Math.random() * PROJECTS_PLACEHOLDERS.length);
  return PROJECTS_PLACEHOLDERS[randomIndex];
}

export function getRandomAccount(): Account {
  const randomIndex = Math.floor(Math.random() * ACCOUNTS_PLACEHOLDER.length);
  return ACCOUNTS_PLACEHOLDER[randomIndex];
}

export default function getPlaceholders() {
  return { EXERCICES_PLACEHOLDER, PROJECTS_PLACEHOLDERS, ACCOUNTS_PLACEHOLDER };
}
