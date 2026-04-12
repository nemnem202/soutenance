// export type TimeSignature = {
//   top: number;
//   bottom: number;
// };

// export type Chord = {
//   note: string;
//   modifier: string;
//   over: Chord | null;
//   alternate: Chord | null;
// };

// export enum SectionType {
//   Generic,
//   A,
//   B,
//   C,
//   D,
//   E,
//   F,
//   G,
//   Intro,
//   Verse,
//   Bridge,
//   Solo,
//   Refrain,
//   Melody,
//   Outro,
//   Tacet,
// }

// export type Cell =
//   | {
//       kind: "Chord";
//       chord: Chord;
//       keyChange: string | null;
//       timeSignatureChange: TimeSignature | null;
//     }
//   | { kind: "Spacer"; keyChange: string | null; timeSignatureChange: TimeSignature | null }
//   | { kind: "Empty"; keyChange: string | null; timeSignatureChange: TimeSignature | null };

// export type VoltaBracket = {
//   volta: 1 | 2 | 3;
//   measures: Measure[];
// };

// export type Measure = {
//   index: number;
//   cells: Cell[];
// };

// export type Section = {
//   index: number;
//   type: SectionType;
//   label: string;
//   commonMeasures: Measure[];
//   voltas: VoltaBracket[];
// };

// export type Config = {
//   bpm: number;
//   timeSignature: TimeSignature;
//   key: string;
//   groove: string;
// };

// export type ChordsGrid = {
//   sections: Section[];
// };

// export type Exercise = {
//   title: string;
//   composer: string;
//   defaultConfig: Config;
//   chordsGrid: ChordsGrid;
//   midiFileUrl: string | null;
// };

// export type Playlist = {
//   title: string;
//   description: string | null;
//   coverUrl: string;
//   createdAt: Date;
//   lastModification: Date;
//   exercises: Exercise[];
// };
