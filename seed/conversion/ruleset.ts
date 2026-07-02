import type {
  CellSchema,
  ChordsGridSchema,
  Config,
  ExerciseSchema,
  MeasureSchema,
} from "@/types/entities";
import type { Cell } from "@/types/music";

export default function applyRuleset(exercise: ExerciseSchema) {
  exercise.chordsGrid && applyChordGridRuleset(exercise.chordsGrid, exercise.defaultConfig);
}

function applyChordGridRuleset(grid: ChordsGridSchema, config: Config) {
  for (const section of grid.sections) {
    section.commonMeasures = filterEmptyMeasures(section.commonMeasures);
    removeUselessEmptyCells(section.commonMeasures);

    for (const volta of section.voltas) {
      volta.measures = filterEmptyMeasures(volta.measures);
      removeUselessEmptyCells(volta.measures);
    }
  }
  removeEmptySections(grid);
  specifyTimeSignature(grid, config);
  correctMeasuresIndexes(grid);
}

function correctMeasuresIndexes(grid: ChordsGridSchema) {
  let currentMeasureIndex = 0;
  let currentSectionIndex = 0;
  const sortedSections = grid.sections.sort((a, b) => a.index - b.index);

  for (const section of sortedSections) {
    section.index = currentSectionIndex++;
    for (const measure of section.commonMeasures) {
      measure.index = currentMeasureIndex++;
    }
    for (const volta of section.voltas) {
      for (const measure of volta.measures) {
        measure.index = currentMeasureIndex++;
      }
    }
  }
}

function filterEmptyMeasures(measures: MeasureSchema[]) {
  return measures.filter((measure) => measure.cells.some((c) => c.kind === "Chord"));
}

function removeUselessEmptyCells(measures: MeasureSchema[]) {
  for (const measure of measures) {
    const codaCellIndex = measure.cells.find((c) => c.isCodaSymbol)?.index;
    const segnoCellIndex = measure.cells.find((c) => c.isSegnoSymbol)?.index;
    const fermataCellIndex = measure.cells.find((c) => c.isFermataSymbol)?.index;

    measure.cells = filterUselessCells(measure.cells);

    for (const cell of measure.cells) {
      cell.isCodaSymbol = false;
      cell.isSegnoSymbol = false;
      cell.isFermataSymbol = false;
    }

    if (measure.cells.length > 0) {
      const target = measure.cells.find((c) => c.index === fermataCellIndex) ?? measure.cells[0];
      // idem pour coda / segno, ou réutiliser target si les index coïncident
      if (fermataCellIndex !== undefined) target.isFermataSymbol = true;
      if (codaCellIndex !== undefined) {
        (measure.cells.find((c) => c.index === codaCellIndex) ?? measure.cells[0]).isCodaSymbol =
          true;
      }
      if (segnoCellIndex !== undefined) {
        (measure.cells.find((c) => c.index === segnoCellIndex) ?? measure.cells[0]).isSegnoSymbol =
          true;
      }
    }
  }
}

function filterUselessCells(cells: Cell[]): Cell[] {
  const chordCells = cells.filter((c) => c.kind === "Chord");
  if (chordCells.length === 1) {
    return chordCells;
  }

  if (matchCellsPattern([true, false, true, false], cells)) {
    return [cells[0], cells[2]];
  }

  if (matchCellsPattern([true, false, false, false, true, false, false, false], cells)) {
    return [cells[0], cells[4]];
  }

  return cells;
}

function matchCellsPattern(pattern: boolean[], cells: Cell[]): boolean {
  if (cells.length !== pattern.length) return false;

  for (let i = 0; i < cells.length; i++) {
    const isChord = cells[i].kind === "Chord";
    const expectedChord = pattern[i];

    if (isChord !== expectedChord) {
      return false;
    }
  }
  return true;
}

function specifyTimeSignature(grid: ChordsGridSchema, config: Config) {
  const first_measure = grid.sections
    .sort((a, b) => a.index - b.index)[0]
    .commonMeasures.sort((a, b) => a.index - b.index)[0]
    .cells.sort((a, b) => a.index - b.index)[0];
  if (!first_measure.timeSignatureChangeTop) {
    first_measure.timeSignatureChangeTop = config.timeSignatureTop;
    first_measure.timeSignatureChangeBottom = config.timeSignatureBottom;
  }
}
function removeEmptySections(grid: ChordsGridSchema) {
  grid.sections = grid.sections.filter((section) => section.commonMeasures.length > 0);
}
