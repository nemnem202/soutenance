import { ChordsGridSchema, MeasureSchema } from "@/types/entities";
import { getMidiFileFromBuffer } from "./midi-to-state";
import { Midi } from "@tonejs/midi";
import { Note } from "@tonejs/midi/dist/Note";
import { Chord as ChordType } from "@/types/music";
import { logger } from "@/lib/logger";
import { Chord } from "tonal";
import { notesByIndex } from "@/schemas/entities.schema";

type Measure = {
  measureIndex: number;
  startTick: number;
  endTick: number;
  duration: number;
  notes: Note[];
  chords?: ChordType[];
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
  return convertToChordsGrid(measureMap);
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
  for (const measure of measureMap.values()) {
    const overlappingBlocks = getOverlappingNotes(measure.notes);
    addChordsToMeasure(measure, overlappingBlocks);
  }
}

type Block = {
  startTick: number;
  endTick: number;
  notes: Note[];
};

function getOverlappingNotes(notes: Note[]): Block[] {
  if (notes.length === 0) return [];

  const blocks: Block[] = [];
  let currentBlock: Block = {
    startTick: notes[0].ticks,
    endTick: notes[0].ticks + notes[0].durationTicks,
    notes: [notes[0]],
  };

  for (let i = 1; i < notes.length; i++) {
    const note = notes[i];

    if (note.ticks <= currentBlock.endTick) {
      currentBlock.notes.push(note);
      currentBlock.endTick = Math.max(currentBlock.endTick, note.ticks + note.durationTicks);
    } else {
      blocks.push(currentBlock);
      currentBlock = {
        startTick: note.ticks,
        endTick: note.ticks + note.durationTicks,
        notes: [note],
      };
    }
  }
  blocks.push(currentBlock);

  return blocks;
}

function addChordsToMeasure(measure: Measure, overlappingBlocks: Block[]) {
  measure.chords = overlappingBlocks.flatMap((block) => [...findChordFromNotes(block.notes)]);
}

function findChordFromNotes(notes: Note[]): ChordType[] {
  const midiNotes = notes.map((n) => n.midi % 12);

  const chords = Chord.detect(midiNotes.map((n) => notesByIndex[n]));

  return chords.map((c) => {
    const chord = Chord.get(c);
    const chordType: ChordType = {
      content: {
        note: chord.tonic ?? "",
        modifier: chord.aliases[0],
      },
      over:
        chord.tonic === chord.root
          ? {
              note: chord.root,
              modifier: "",
            }
          : undefined,
    };

    return chordType;
  });
}

function logMeasureMapSummary(measureMap: MeasureMap) {
  const rows = Array.from(measureMap.values()).map((measure) => ({
    mesure: measure.measureIndex,
    ticks: `${measure.startTick} → ${measure.endTick}`,
    accords:
      measure.chords?.map((c) => `${c.content.note}${c.content.modifier}`).join("  |  ") ||
      "(silence)",
  }));

  logger.info(`Grille d'accords extraite — ${rows.length} mesures`);
  logger.table(rows);
}

function convertToChordsGrid(measureMap: MeasureMap): ChordsGridSchema {
  const measures = Array.from(measureMap.values());

  const measureObjects: MeasureSchema[] = measures.map((m) => ({
    index: m.measureIndex,
    bars: { left: "single", right: "single" }, // Valeurs par défaut
    cells:
      m.chords && m.chords.length > 0
        ? m.chords.map((chord, idx) => ({
            kind: "Chord" as const,
            index: idx,
            isCodaSymbol: false,
            isSegnoSymbol: false,
            isFermataSymbol: false,
            isFineSymbol: false,
            isBreakSymbol: false,
            chord: {
              content: {
                note: chord.content.note as any, // Cast sécurisé selon votre schema
                modifier: chord.content.modifier,
              },
              over: chord.over
                ? {
                    note: chord.over.note as any,
                    modifier: chord.over.modifier,
                  }
                : null,
            },
          }))
        : [
            {
              kind: "Empty" as const,
              index: 0,
              isCodaSymbol: false,
              isSegnoSymbol: false,
              isFermataSymbol: false,
              isFineSymbol: false,
              isBreakSymbol: false,
            },
          ],
  }));

  return {
    sections: [
      {
        index: 0,
        label: "Main",
        type: "Generic",
        commonMeasures: measureObjects,
        voltas: [],
      },
    ],
  };
}
