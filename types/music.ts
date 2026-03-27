export const Notes = [
  "C",
  "C♯",
  "D♭",
  "D",
  "D♯",
  "E♭",
  "E",
  "F",
  "F♯",
  "G♭",
  "G",
  "G♯",
  "A♭",
  "A",
  "A♯",
  "B♭",
  "B",
  "%",
] as const;

export type Note = (typeof Notes)[number];

export type ChordIntervals = number[];
export type ChordLabel = string;
export type ChordHarmony = { intervals: ChordIntervals; labels: ChordLabel[]; symbolLabel: ChordLabel };
export type ChordDictionary = Record<string, ChordHarmony | null>;

export interface Chord {
  root: Note;
  harm: ChordHarmony | null;
  tickStart: number;
  tickEnd: number;
}

export interface CarouselChord extends Chord {
  index: number;
}
