import { ChordsGridSchema } from "@/types/entities";
import { getMidiFileFromBuffer } from "./midiconverter";
import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";
import { Chord } from "@/types/music";
import { logger } from "@/lib/logger";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import { notesByIndex } from "@/schemas/entities.schema";

type Measure = {
  measureIndex: number;
  startTick: number;
  endTick: number;
  duration: number;
  notes: Note[];
  chords?: Chord[];
};

type MeasureMap = Map<number, Measure>;

export default async function convertMidiFileToChordGrid(
  file: File
): Promise<ChordsGridSchema | null> {
  const buffer = await file.arrayBuffer();
  const midi = await getMidiFileFromBuffer(buffer);
  const notes = midi.tracks.flatMap((t) => t.notes);
  const measureMap = extractMeasureMap(midi, notes);
  defineChords(measureMap);
  logger.info("MeasuresMap: ", Array.from(measureMap));
  return null;
}

function extractMeasureMap(midi: Midi, notes: Note[]): MeasureMap {
  const { timeSignatures, ppq } = midi.header;
  const measureMap: MeasureMap = new Map();

  const lastTick = notes.reduce((max, n) => Math.max(max, n.ticks + n.durationTicks), 0);

  const sortedTS = [...timeSignatures].sort((a, b) => a.ticks - b.ticks);
  if (sortedTS.length === 0 || sortedTS[0].ticks !== 0) {
    sortedTS.unshift({
      ticks: 0,
      timeSignature: [4, 4],
    } as (typeof sortedTS)[number]);
  }

  let measureIndex = 0;
  let currentTick = 0;

  // define measures positions

  for (let i = 0; i < sortedTS.length; i++) {
    const { timeSignature } = sortedTS[i];
    const [numerator, denominator] = timeSignature;
    const ticksPerMeasure = ppq * 4 * (numerator / denominator);
    const sectionEndTick = i + 1 < sortedTS.length ? sortedTS[i + 1].ticks : lastTick;

    while (currentTick < sectionEndTick) {
      const startTick = currentTick;
      const endTick = startTick + ticksPerMeasure;

      measureMap.set(startTick, {
        measureIndex,
        startTick,
        endTick,
        duration: endTick - startTick,
        notes: [],
      });

      currentTick = endTick;
      measureIndex++;
    }
  }

  const measures = Array.from(measureMap.values());

  const sortedNotes = [...notes].sort((a, b) => a.ticks - b.ticks);

  let measurePointer = 0;

  // fill measure with notes

  for (const note of sortedNotes) {
    while (measurePointer < measures.length - 1 && note.ticks >= measures[measurePointer].endTick) {
      measurePointer++;
    }

    const measure = measures[measurePointer];
    if (measure && note.ticks >= measure.startTick && note.ticks < measure.endTick) {
      measure.notes.push(note);
    }
  }

  return measureMap;
}

function defineChords(measureMap: MeasureMap) {
  for (const [startTick, measure] of measureMap) {
    const overlappingNotes = getOverlappingNotes(measure.notes);
    addChordsToMeasure(measure, overlappingNotes);
  }
}

type Block = {
  startTick: number;
  endTick: number;
  notes: Note[];
};

function getOverlappingNotes(notes: Note[]): Block[] {
  const notesCopy = [...notes];
  const blocks: Block[] = [];

  while (notesCopy.length) {
    const firstNote = notesCopy[0];
    const compaptibleBlock = blocks.find(
      (b) => b.startTick <= firstNote.ticks && b.endTick >= firstNote.ticks
    );

    if (compaptibleBlock) {
      compaptibleBlock.notes.push(firstNote);
      if (compaptibleBlock.endTick < firstNote.ticks + firstNote.durationTicks)
        compaptibleBlock.endTick = firstNote.ticks + firstNote.durationTicks;
    } else {
      blocks.push({
        endTick: firstNote.ticks + firstNote.durationTicks,
        startTick: firstNote.ticks,
        notes: [firstNote],
      });
    }
    notesCopy.shift();
  }

  return blocks;
}

function addChordsToMeasure(measure: Measure, overlappingNotes: Block[]) {
  const chords: Chord[] = overlappingNotes.map((block) => findChordFromNotes(block.notes));
  measure.chords = chords;
}

function findChordFromNotes(notes: Note[]): Chord {
  const midiNotes = notes.map((n) => n.midi % 11);
  logger.info("Modulo midi notes", midiNotes);
  let filtered: number[] = [];
  midiNotes.forEach((midi) => {
    if (!filtered.some((f) => f === midi)) {
      filtered.push(midi);
    }
  });

  filtered.sort((a, b) => a - b);

  const minValue = filtered[0];

  filtered = filtered.map((v) => v - minValue);

  let chordsExactMatch: string | null = null;

  for (const [chordName, harmony] of Object.entries(CHORDS_DICTIONNARY)) {
    if (!harmony) continue;
    const isExactMatch = filtered.every((f) => harmony.intervals.includes(f));
    if (!isExactMatch) continue;
    chordsExactMatch = chordName;
    break;
  }

  if (!chordsExactMatch) {
    return {
      content: {
        note: "Unknown",
        modifier: "",
      },
    };
  } else {
    return {
      content: {
        note: notesByIndex[minValue],
        modifier: chordsExactMatch,
      },
    };
  }
}
