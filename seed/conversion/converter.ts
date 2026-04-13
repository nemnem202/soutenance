import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import type { CellIreal, ChordIreal, PlaylistIreal, SongIreal } from "./chart_decoder";
import { SectionType } from "@/lib/generated/prisma/enums";
import type {
  CellSchema,
  ChordSchema,
  ConfigSchema,
  ExerciseSchema,
  MeasureSchema,
  PlaylistSchema,
  SectionSchema,
  TimeSignatureSchema,
  VoltaSchema,
} from "@/types/entities";
import type { Note } from "@/types/music";
import { faker } from "@faker-js/faker";

class IrealConversionError extends Error {
  constructor(context: string, message: string) {
    super(`[${context}] ${message}`);
    this.name = "IrealConversionError";
  }
}

function validateAndConvertChord(chordIreal: ChordIreal): ChordSchema {
  let { note, modifier, over, alternate } = chordIreal;
  note = (note || "").trim().toUpperCase();

  const noteMapping: Record<string, string> = {
    X: "%",
    R: "%",
    W: "%",
    P: "%",
    N: "C",
    H: "B",
    "": "C",
    " ": "C",
  };

  if (noteMapping[note] !== undefined) {
    note = noteMapping[note];
  }
  if (note.length === 2 && note.endsWith("B")) {
    note = `${note.charAt(0)}b`;
  }

  const isValid =
    modifier === "" ||
    modifier in CHORDS_DICTIONNARY ||
    Object.values(CHORDS_DICTIONNARY).some((entry) => entry?.labels.includes(modifier));

  if (!isValid) {
    throw new IrealConversionError(
      "validateChord",
      `Modificateur d'accord inconnu : "${modifier}" (note: ${note})`
    );
  }
  return {
    content: {
      modifier: modifier,
      note: note as Note,
    },
    over: over ? validateAndConvertChord(over).content : null,
    alt: alternate ? validateAndConvertChord(alternate).content : null,
  };
}

const SECTION_ANNOT_MAP: Record<string, SectionType> = {
  "*": SectionType.Generic,
  "*A": SectionType.A,
  "*B": SectionType.B,
  "*C": SectionType.C,
  "*D": SectionType.D,
  "*E": SectionType.E,
  "*F": SectionType.F,
  "*G": SectionType.G,
  "*I": SectionType.Intro,
  "*V": SectionType.Verse,
  "*b": SectionType.Bridge,
  "*S": SectionType.Solo,
  "*R": SectionType.Refrain,
  "*M": SectionType.Melody,
  "*O": SectionType.Outro,
  "*X": SectionType.Tacet,
};

const IGNORED_ANNOTATIONS = new Set([
  "N|",
  "N*",
  "N6",
  "N.",
  "NO",
  "NE",
  "NA",
  "*Q",
  "*Z",
  "*N",
  "*H",
  "*U",
  "*L2",
  "*N",
  "*R2",
  "*F2",
  "T",
]);

type ParsedAnnotations = {
  sectionType: SectionType | null;
  timeSignatureChange: TimeSignatureSchema | null;
  volta: 1 | 2 | 3 | null;
  isVoltaPickup: boolean;
  isCoda: boolean;
  isSegno: boolean;
  isFermata: boolean;
  isEnd: boolean;
  isRepeatMeasure: boolean;
};

function parseAnnotations(annots: string[]): ParsedAnnotations {
  const result: ParsedAnnotations = {
    sectionType: null,
    timeSignatureChange: null,
    volta: null,
    isVoltaPickup: false,
    isCoda: false,
    isSegno: false,
    isFermata: false,
    isEnd: false,
    isRepeatMeasure: false,
  };

  for (const raw of annots) {
    const norm = raw === "s" || raw === "l" || raw === "f" || raw === "b" ? raw : raw.toUpperCase();

    if (IGNORED_ANNOTATIONS.has(norm)) continue;

    if (norm.startsWith("*")) {
      const mapped = SECTION_ANNOT_MAP[norm];
      if (mapped !== undefined) {
        result.sectionType = mapped;
      }

      continue;
    }

    if (norm.startsWith("T") && norm.length > 1) {
      result.timeSignatureChange = parseTimeSignature(norm);
      continue;
    }

    if (norm === "N1") {
      result.volta = 1;
      continue;
    }
    if (norm === "N2") {
      result.volta = 2;
      continue;
    }
    if (norm === "N3") {
      result.volta = 3;
      continue;
    }
    if (norm === "N0") {
      result.isVoltaPickup = true;
      continue;
    }

    if (raw === "Q") {
      result.isCoda = true;
      continue;
    }
    if (raw === "S") {
      result.isSegno = true;
      continue;
    }
    if (raw === "f") {
      result.isFermata = true;
      continue;
    }
    if (raw === "U") {
      result.isEnd = true;
      continue;
    }
    if (raw === "l") {
      result.isRepeatMeasure = true;
      continue;
    }
    if (raw === "s") continue;
  }

  return result;
}

function parseTimeSignature(token: string): TimeSignatureSchema {
  const VALID: Record<string, TimeSignatureSchema> = {
    T44: { top: 4, bottom: 4 },
    T34: { top: 3, bottom: 4 },
    T24: { top: 2, bottom: 4 },
    T54: { top: 5, bottom: 4 },
    T64: { top: 6, bottom: 4 },
    T74: { top: 7, bottom: 4 },
    T22: { top: 2, bottom: 2 },
    T32: { top: 3, bottom: 2 },
    T12: { top: 1, bottom: 2 },
    T38: { top: 3, bottom: 8 },
    T58: { top: 5, bottom: 8 },
    T68: { top: 6, bottom: 8 },
    T78: { top: 7, bottom: 8 },
    T98: { top: 9, bottom: 8 },
  };

  const ts = VALID[token];
  if (!ts) {
    throw new IrealConversionError("parseTimeSignature", `Token inconnu : "${token}"`);
  }
  return ts;
}

type ParsedBars = {
  leftBar: "single" | "repeatOpen" | "sectionOpen" | null;
  rightBar: "single" | "repeatClose" | "sectionClose" | "final" | null;
  isEmpty: boolean;
};

function parseBars(bars: string): ParsedBars {
  if (bars === "vide" || bars === "") {
    return { leftBar: null, rightBar: null, isEmpty: false };
  }

  if (bars === "()") {
    return { leftBar: null, rightBar: null, isEmpty: true };
  }

  const LEFT_MAP: Record<string, ParsedBars["leftBar"]> = {
    "(": "single",
    "[": "repeatOpen",
    "{": "sectionOpen",
  };

  const RIGHT_MAP: Record<string, ParsedBars["rightBar"]> = {
    ")": "single",
    "]": "repeatClose",
    "}": "sectionClose",
    Z: "final",
  };

  const leftChar = bars[0];
  const rightChar = bars[bars.length - 1];

  return {
    leftBar: LEFT_MAP[leftChar] ?? null,
    rightBar: RIGHT_MAP[rightChar] ?? null,
    isEmpty: false,
  };
}

function getSectionLabel(type: SectionType, index: number): string {
  const LABELS: Record<SectionType, string> = {
    [SectionType.Generic]: "Section",
    [SectionType.A]: "A",
    [SectionType.B]: "B",
    [SectionType.C]: "C",
    [SectionType.D]: "D",
    [SectionType.E]: "E",
    [SectionType.F]: "F",
    [SectionType.G]: "G",
    [SectionType.Intro]: "Intro",
    [SectionType.Verse]: "Verse",
    [SectionType.Bridge]: "Bridge",
    [SectionType.Solo]: "Solo",
    [SectionType.Refrain]: "Refrain",
    [SectionType.Melody]: "Melody",
    [SectionType.Outro]: "Outro",
    [SectionType.Tacet]: "Tacet",
  };
  return LABELS[type] ?? `Section ${index}`;
}

function convertCell(cellIreal: CellIreal): CellSchema {
  const { chord, spacer } = cellIreal;

  if (spacer > 0) return { kind: "Spacer" };
  if (chord === null) return { kind: "Empty" };

  const { annots } = cellIreal;
  const parsed = parseAnnotations(annots);

  return {
    kind: "Chord",
    chord: validateAndConvertChord(chord),
    keychange: null,
    timeSignatureChangeBottom: parsed.timeSignatureChange?.bottom,
    timeSignatureChangeTop: parsed.timeSignatureChange?.top,
  };
}

function convertSong(song: SongIreal): ExerciseSchema {
  const { title, key, bpm, groove, cells } = song;

  if (!key || key === "n") {
    throw new IrealConversionError("convertSong", `Tonalité manquante ou invalide dans "${title}"`);
  }

  let globalTimeSignature: TimeSignatureSchema = { top: 4, bottom: 4 };
  for (const cell of cells) {
    for (const annot of cell.annots) {
      if (annot.startsWith("T") && annot.length > 1) {
        try {
          globalTimeSignature = parseTimeSignature(annot.toUpperCase());
          break;
        } catch {}
      }
    }
    if (globalTimeSignature.top !== 4) break;
  }

  const config: ConfigSchema = {
    bpm,
    groove,
    key,
    timeSignatureBottom: globalTimeSignature.bottom,
    timeSignatureTop: globalTimeSignature.top,
  };

  const sections = buildSections(cells);

  return {
    title: song.title,
    composer: song.composer,
    chordsGrid: { sections },
    defaultConfig: config,
    midifileUrl: null,
  };
}

function buildSections(cells: CellIreal[]): SectionSchema[] {
  const sections: SectionSchema[] = [];
  let currentSection: SectionSchema | null = null;
  let currentMeasure: MeasureSchema | null = null;
  let currentVolta: VoltaSchema | null = null;
  let measureIndex = 0;
  let sectionIndex = 0;

  function pushMeasure() {
    if (!currentMeasure || currentMeasure.cells.length === 0) return;
    if (!currentSection) return;

    if (currentVolta) {
      currentVolta.measures.push(currentMeasure);
    } else {
      currentSection.commonMeasures.push(currentMeasure);
    }
    currentMeasure = null;
  }

  function pushSection() {
    if (!currentSection) return;
    pushMeasure();
    sections.push(currentSection);
    currentSection = null;
    currentVolta = null;
  }

  function startSection(type: SectionType) {
    pushSection();
    currentSection = {
      index: sectionIndex++,
      type,
      label: getSectionLabel(type, sectionIndex),
      commonMeasures: [],
      voltas: [],
    };
    currentMeasure = { index: measureIndex++, cells: [] };
  }

  function startVolta(volta: 1 | 2 | 3) {
    if (!currentSection) {
      throw new IrealConversionError("buildSections", `Volta ${volta} sans section parente`);
    }
    pushMeasure();
    currentVolta = { volta, measures: [] };
    currentSection.voltas.push(currentVolta);
    currentMeasure = { index: measureIndex++, cells: [] };
  }

  for (const cellIreal of cells) {
    const parsedAnnots = parseAnnotations(cellIreal.annots);
    const parsedBars = parseBars(cellIreal.bars);

    if (parsedAnnots.sectionType !== null) {
      startSection(parsedAnnots.sectionType);
    }

    if (!currentSection) {
      startSection(SectionType.Generic);
    }

    if (parsedBars.leftBar !== null && currentMeasure && currentMeasure.cells.length > 0) {
      pushMeasure();
      currentMeasure = { index: measureIndex++, cells: [] };
    }

    if (parsedAnnots.volta !== null) {
      startVolta(parsedAnnots.volta);
    }

    if (parsedBars.isEmpty) {
      currentMeasure ??= { index: measureIndex++, cells: [] };
      currentMeasure.cells.push({ kind: "Empty" });
    } else {
      const cell = convertCell(cellIreal);
      currentMeasure ??= { index: measureIndex++, cells: [] };
      currentMeasure.cells.push(cell);
    }

    if (parsedBars.rightBar === "final" || parsedBars.rightBar === "sectionClose") {
      pushMeasure();
      if (parsedBars.rightBar === "final") {
        pushSection();
      }
    }
  }

  pushSection();

  if (sections.length === 0) {
    throw new IrealConversionError("buildSections", "Aucune section trouvée dans la grille");
  }

  return sections;
}

export function convertPlaylist(playlistIreal: PlaylistIreal): {
  playlist: PlaylistSchema;
  failures: { title: string; error: string }[];
} {
  const exercises: ExerciseSchema[] = [];
  const failures: { title: string; error: string }[] = [];

  for (const song of playlistIreal.songs) {
    try {
      exercises.push(convertSong(song));
    } catch (err) {
      failures.push({
        title: song.title,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    playlist: {
      title: playlistIreal.title,
      description: undefined,
      cover: {
        alt: `The cover of the playlist ${playlistIreal.title}`,
        url: faker.image.urlPicsumPhotos({ width: 500, height: 500 }),
      },
      exercises,
      tags: [],
      visibility: "public",
    },
    failures,
  };
}
