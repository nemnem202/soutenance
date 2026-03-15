import { CHORDS_DICTIONNARY } from "@/config/chords-dictionnary";

export const Notes = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
] as const;

export type Note = (typeof Notes)[number];

export type ChordHarmony = keyof typeof CHORDS_DICTIONNARY;

export interface Chord {
  root: Note;
  harm: ChordHarmony;
  tickStart: number;
  tickEnd: number;
}

export interface CarouselChord extends Chord {
  index: number;
}
