import type { ChordsGridSchema, ExerciseSchema, MeasureSchema } from "@/types/entities";
import type { Cell } from "@/types/music";

export default function applyRuleset(exercise: ExerciseSchema) {
  exercise.chordsGrid && applyChordGridRuleset(exercise.chordsGrid);
}

function applyChordGridRuleset(grid: ChordsGridSchema) {
  for (const section of grid.sections) {
    section.commonMeasures = filterEmptyMeasures(section.commonMeasures);
    removeUselessEmptyCells(section.commonMeasures);

    for (const volta of section.voltas) {
      volta.measures = filterEmptyMeasures(volta.measures);
      removeUselessEmptyCells(volta.measures);
    }
  }
}

function filterEmptyMeasures(measures: MeasureSchema[]) {
  return measures.filter((measure) => measure.cells.some((c) => c.kind === "Chord"));
}

function removeUselessEmptyCells(measures: MeasureSchema[]) {
  for (const measure of measures) {
    measure.cells = filterUselessCells(measure.cells);
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
