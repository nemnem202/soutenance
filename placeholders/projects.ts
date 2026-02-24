import { Exercice, Project } from "@/types/project";
import { Faker, en } from "@faker-js/faker";

const faker = new Faker({ locale: [en] });

const generateExercice = (): Exercice => ({
  id: faker.string.uuid(),
  title: faker.music.songName(),
  author: faker.person.firstName(),
  composer: faker.music.artist(),
  config: {
    bpm: faker.number.int({ min: 60, max: 200 }),
  },
  creation: faker.date.anytime(),
  hasChords: faker.datatype.boolean(),
  haseMelody: faker.datatype.boolean(),
  midiFileId: faker.string.uuid(),
});

const generateProject = (exercices: Exercice[]): Project => {
  const nbExercices = faker.number.int({ min: 1, max: 5 });

  const selectedExercices = faker.helpers.arrayElements(exercices, nbExercices);

  return {
    id: faker.string.uuid(),
    author: faker.person.firstName(),
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

export const EXERCICES_PLACEHOLDER: Exercice[] = Array.from({ length: 2000 }, () => generateExercice());

export const PROJECTS_PLACEHOLDERS: Project[] = Array.from({ length: 200 }, () =>
  generateProject(EXERCICES_PLACEHOLDER),
);

export function getRandomProject(): Project {
  const randomIndex = Math.floor(Math.random() * PROJECTS_PLACEHOLDERS.length);
  return PROJECTS_PLACEHOLDERS[randomIndex];
}
