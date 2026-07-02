import { faker } from "@faker-js/faker";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
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
import type { CellIreal, ChordIreal, PlaylistIreal, SongIreal } from "./chart_decoder";
import applyRuleset from "./ruleset";
import { logger } from "@/lib/logger";

export class IrealConversionError extends Error {
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
  "*X": SectionType.Tacet,
  "*Q": SectionType.Outro,
  "*O": SectionType.Outro,
};

const IGNORED_ANNOTATIONS = new Set([
  "N|",
  "N*",
  "N6",
  "N.",
  "NO",
  "NE",
  "NA",
  // "*Q",
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
  leftBar: "single" | "double" | "loopOpen" | null;
  rightBar: "single" | "double" | "loopClose" | "final" | null;
  isEmpty: boolean;
};

function parseBars(bars: string): ParsedBars {
  if (bars === "") return { leftBar: null, rightBar: null, isEmpty: false };

  const LEFT_MAP: Record<string, ParsedBars["leftBar"]> = {
    "(": "single",
    "[": "double",
    "{": "loopOpen",
  };

  const RIGHT_MAP: Record<string, ParsedBars["rightBar"]> = {
    ")": "single",
    "]": "double",
    "}": "loopClose",
    Z: "final",
  };

  const leftChar = bars[0];
  const rightChar = bars[bars.length - 1];

  return {
    leftBar: LEFT_MAP[leftChar] ?? null,
    rightBar: RIGHT_MAP[rightChar] ?? null,
    isEmpty: bars === "()",
  };
}

type ParsedComments = {
  isFineSymbol: boolean;
  isBreakSymbol: boolean;
  navigation: {
    origin: "DC" | "DS";
    target: "Fine" | "Coda" | "1stEnding" | "2ndEnding" | "3rdEnding";
  } | null;
  repeatCount: number | null;
  rhythmGrouping: "3+2" | "2+3" | "4+3" | "3+4" | null;
};

const ENDING_MAP: Record<string, "1stEnding" | "2ndEnding" | "3rdEnding"> = {
  "1st": "1stEnding",
  "2nd": "2ndEnding",
  "3rd": "3rdEnding",
};

function parseComments(comments: string[]): ParsedComments {
  const result: ParsedComments = {
    isFineSymbol: false,
    isBreakSymbol: false,
    navigation: null,
    repeatCount: null,
    rhythmGrouping: null,
  };

  for (const raw of comments) {
    const text = raw.trim();

    if (/^fine$/i.test(text)) {
      result.isFineSymbol = true;
      continue;
    }

    if (/^break$/i.test(text)) {
      result.isBreakSymbol = true;
      continue;
    }

    // D.C./D.S. al Fine | al Coda | al 1st/2nd/3rd ending
    const navMatch = text.match(/^D\.?\s*(C|S)\.?\s+al\s+(Fine|Coda|1st|2nd|3rd)(\s+end(ing)?)?$/i);
    if (navMatch) {
      const origin = navMatch[1].toUpperCase() === "C" ? "DC" : "DS";
      const rawTarget = navMatch[2];
      const target =
        rawTarget.toLowerCase() === "fine"
          ? "Fine"
          : rawTarget.toLowerCase() === "coda"
            ? "Coda"
            : ENDING_MAP[rawTarget.toLowerCase()];
      result.navigation = { origin, target };
      continue;
    }

    // Répétitions : 3x .. 8x
    const repeatMatch = text.match(/^([3-8])x$/i);
    if (repeatMatch) {
      result.repeatCount = parseInt(repeatMatch[1], 10);
      continue;
    }

    // Groupements rythmiques
    if (["3+2", "2+3", "4+3", "3+4"].includes(text)) {
      result.rhythmGrouping = text as ParsedComments["rhythmGrouping"];
      continue;
    }
  }

  if (result.navigation) logger.info("Comment navigation found: ", result.navigation);

  return result;
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
  const { chord, spacer, annots, comments } = cellIreal;
  const parsedAnnots = parseAnnotations(annots);
  const parsedComments = parseComments(comments);

  const commonFields = {
    isCodaSymbol: parsedAnnots.isCoda,
    isSegnoSymbol: parsedAnnots.isSegno,
    isFermataSymbol: parsedAnnots.isFermata,
    isFineSymbol: parsedComments.isFineSymbol,
    isBreakSymbol: parsedComments.isBreakSymbol,
    navigation: parsedComments.navigation,
    rhythmGrouping: parsedComments.rhythmGrouping,
  };

  if (spacer > 0) return { kind: "Spacer", index: cellIreal.index, ...commonFields };
  if (chord === null) return { kind: "Empty", index: cellIreal.index, ...commonFields };

  return {
    index: cellIreal.index,
    kind: "Chord",
    chord: validateAndConvertChord(chord),
    keychange: null,
    timeSignatureChangeBottom: parsedAnnots.timeSignatureChange?.bottom,
    timeSignatureChangeTop: parsedAnnots.timeSignatureChange?.top,
    ...commonFields,
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
    groove: "BossaNova",
    key,
    timeSignatureBottom: globalTimeSignature.bottom,
    timeSignatureTop: globalTimeSignature.top,
  };

  const sections = buildSections(cells);

  const exercise = {
    title: song.title,
    composer: song.composer,
    chordsGrid: { sections },
    defaultConfig: config,
    midifileUrl: null,
  };

  return exercise;
}

function buildSections(cells: CellIreal[]): SectionSchema[] {
  const sections: SectionSchema[] = [];
  let currentSection: SectionSchema | null = null;
  let currentMeasure: MeasureSchema | null = null;
  let currentVolta: VoltaSchema | null = null;
  let measureIndex = 0;
  let sectionIndex = 0;

  function ensureSection(type: SectionType = SectionType.Generic) {
    if (!currentSection) {
      currentSection = {
        index: sectionIndex++,
        type,
        label: getSectionLabel(type, sectionIndex),
        commonMeasures: [],
        voltas: [],
        repeatCount: null,
      };
    }
    return currentSection;
  }

  function pushMeasure() {
    if (!currentMeasure || currentMeasure.cells.length === 0) return;
    const section = ensureSection();

    if (currentVolta) {
      currentVolta.measures.push(currentMeasure);
    } else {
      section.commonMeasures.push(currentMeasure);
    }
    currentMeasure = null;
  }

  for (const cellIreal of cells) {
    const parsedAnnots = parseAnnotations(cellIreal.annots);
    const parsedBars = parseBars(cellIreal.bars);
    const parsedComments = parseComments(cellIreal.comments);

    let effectiveSectionType = parsedAnnots.sectionType;

    if (effectiveSectionType !== null) {
      pushMeasure();
      if (currentSection) sections.push(currentSection);
      currentSection = null;
      ensureSection(effectiveSectionType);
      currentVolta = null;
    } else {
      ensureSection();
    }

    const section = ensureSection();

    if (parsedAnnots.volta !== null) {
      pushMeasure();
      currentVolta = {
        index: parsedAnnots.volta as 1 | 2 | 3,
        measures: [],
      };
      section.voltas.push(currentVolta);
    }

    if (parsedBars.leftBar !== null && currentMeasure && currentMeasure.cells.length > 0) {
      pushMeasure();
    }

    if (!currentMeasure) {
      currentMeasure = {
        index: measureIndex++,
        cells: [],
        bars: { left: parsedBars.leftBar, right: null },
      };
    }

    if (parsedBars.isEmpty && !cellIreal.chord) {
      currentMeasure.cells.push({
        kind: "Empty",
        index: cellIreal.index,
        isCodaSymbol: false,
        isSegnoSymbol: false,
        isFermataSymbol: false,
        isBreakSymbol: false,
        isFineSymbol: false,
      });
    } else {
      currentMeasure.cells.push(convertCell(cellIreal));
    }

    if (parsedBars.rightBar !== null) {
      currentMeasure.bars.right = parsedBars.rightBar;

      if (parsedComments.repeatCount !== null) {
        section.repeatCount = parsedComments.repeatCount;
      }

      pushMeasure();
    }
  }

  pushMeasure();
  if (currentSection) sections.push(currentSection);

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
      const converted = convertSong(song);
      applyRuleset(converted);
      exercises.push(converted);
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
