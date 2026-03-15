import { CHORDS_DICTIONNARY } from "@/config/chords-dictionnary";
import { CarouselChord, ChordHarmony, Notes } from "@/types/midi";
import { faker } from "@faker-js/faker";

const HARMONIES = Object.keys(CHORDS_DICTIONNARY) as ChordHarmony[];

export const CHORDS_PLACEHOLDER: CarouselChord[] = Array.from({ length: 10 }, (_, index) => {
  const root = faker.helpers.arrayElement(Notes);
  const harm = faker.helpers.arrayElement(HARMONIES);

  const tickStart = index * 480;
  const tickEnd = tickStart + faker.number.int({ min: 240, max: 960 });

  return {
    index,
    root,
    harm,
    tickStart,
    tickEnd,
  };
});

export default function ChordCarousel() {
  return <div className="size-full flex items-center justify-center">qsdqd</div>;
}
