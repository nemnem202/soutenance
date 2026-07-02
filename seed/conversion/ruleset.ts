import type {
  CellSchema,
  ChordsGridSchema,
  Config,
  ExerciseSchema,
  MeasureSchema,
} from "@/types/entities";
import type { Cell } from "@/types/music";
import { IrealConversionError } from "./converter";

export default function applyRuleset(exercise: ExerciseSchema) {
  if (!exercise.chordsGrid) return;
  applyChordGridRuleset(exercise.chordsGrid, exercise.defaultConfig);
  validateNavigationInstructions(exercise.chordsGrid);
}

function* iterateCellsInOrder(
  grid: ChordsGridSchema
): Generator<{ cell: Cell; measure: MeasureSchema }> {
  const sortedSections = [...grid.sections].sort((a, b) => a.index - b.index);
  for (const section of sortedSections) {
    const sortedMeasures = [...section.commonMeasures].sort((a, b) => a.index - b.index);
    for (const measure of sortedMeasures) {
      for (const cell of [...measure.cells].sort((a, b) => a.index - b.index)) {
        yield { cell, measure };
      }
    }
    for (const volta of section.voltas) {
      const sortedVoltaMeasures = [...volta.measures].sort((a, b) => a.index - b.index);
      for (const measure of sortedVoltaMeasures) {
        for (const cell of [...measure.cells].sort((a, b) => a.index - b.index)) {
          yield { cell, measure };
        }
      }
    }
  }
}

function validateNavigationInstructions(grid: ChordsGridSchema) {
  let hasFine = false;
  let hasCoda = false;
  const voltasSeen = new Set<1 | 2 | 3>();

  // Premier passage : recenser ce qui existe dans la grille
  for (const { cell } of iterateCellsInOrder(grid)) {
    if (cell.isFineSymbol) hasFine = true;
    if (cell.isCodaSymbol) hasCoda = true;
  }
  for (const section of grid.sections) {
    for (const volta of section.voltas) {
      voltasSeen.add(volta.index as any);
    }
  }

  // Second passage : valider chaque instruction de navigation
  for (const { cell } of iterateCellsInOrder(grid)) {
    if (!cell.navigation) continue;
    const { origin, target } = cell.navigation;
    const label = `${origin === "DC" ? "D.C." : "D.S."} al ${target}`;

    if (target === "Fine" && !hasFine) {
      throw new IrealConversionError(
        "validateNavigationInstructions",
        `"${label}" trouvé (cellule ${cell.index}) mais aucun symbole "Fine" n'existe dans la grille.`
      );
    }

    if (target === "Coda" && !hasCoda) {
      throw new IrealConversionError(
        "validateNavigationInstructions",
        `"${label}" trouvé (cellule ${cell.index}) mais aucun symbole Coda n'existe dans la grille.`
      );
    }

    if (target === "1stEnding" && !voltasSeen.has(1)) {
      throw new IrealConversionError(
        "validateNavigationInstructions",
        `"${label}" trouvé (cellule ${cell.index}) mais aucune 1st ending (volta 1) n'existe.`
      );
    }
    if (target === "2ndEnding" && !voltasSeen.has(2)) {
      throw new IrealConversionError(
        "validateNavigationInstructions",
        `"${label}" trouvé (cellule ${cell.index}) mais aucune 2nd ending (volta 2) n'existe.`
      );
    }
    if (target === "3rdEnding" && !voltasSeen.has(3)) {
      throw new IrealConversionError(
        "validateNavigationInstructions",
        `"${label}" trouvé (cellule ${cell.index}) mais aucune 3rd ending (volta 3) n'existe.`
      );
    }
  }
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
    measure.cells = filterAndPreserveSymbols(measure.cells);
  }
}

function filterAndPreserveSymbols(cells: Cell[]): Cell[] {
  const kept = filterUselessCells(cells);
  const keptSet = new Set(kept);
  let lastKeptCell: Cell | null = null;

  for (const cell of cells) {
    if (keptSet.has(cell)) {
      lastKeptCell = cell;
      continue;
    }

    const hasAnySymbol =
      cell.isCodaSymbol ||
      cell.isSegnoSymbol ||
      cell.isFermataSymbol ||
      cell.isFineSymbol ||
      cell.isBreakSymbol ||
      cell.navigation !== null;

    if (hasAnySymbol) {
      const target = lastKeptCell ?? kept[0] ?? null;
      if (target) {
        if (cell.isCodaSymbol) target.isCodaSymbol = true;
        if (cell.isSegnoSymbol) target.isSegnoSymbol = true;
        if (cell.isFermataSymbol) target.isFermataSymbol = true;
        if (cell.isFineSymbol) target.isFineSymbol = true;
        if (cell.isBreakSymbol) target.isBreakSymbol = true;
        if (cell.navigation) target.navigation = cell.navigation;
      }
    }
  }

  return kept;
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
