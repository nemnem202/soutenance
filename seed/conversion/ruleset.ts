import type { ChordsGridSchema, ExerciseSchema, MeasureSchema } from "@/types/entities";

export default function applyRuleset(exercise: ExerciseSchema) {
  exercise.chordsGrid && removeEmptyMeasures(exercise.chordsGrid);
}

function removeEmptyMeasures(grid: ChordsGridSchema) {
  for (const section of grid.sections) {
    section.commonMeasures = filterEmptyMeasures(section.commonMeasures);

    for (const voltas of section.voltas) {
      voltas.measures = filterEmptyMeasures(voltas.measures);
    }
  }
}

function filterEmptyMeasures(measures: MeasureSchema[]) {
  return measures.filter((measure) => measure.cells.some((c) => c.kind === "Chord"));
}
