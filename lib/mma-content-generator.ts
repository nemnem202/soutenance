import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import type { ExerciseWithForcedChordGrid } from "@/controllers/MidiController";
import type { Cell } from "@/types/music";
import { logger } from "./logger";
import type { MeasureSchema } from "@/types/entities";
import { MMAGrooveTitle } from "@/config/grooves_dictionnary";

export default class MMAContentGenerator {
  constructor(
    private readonly exercise: ExerciseWithForcedChordGrid,
    private readonly groove: MMAGrooveTitle
  ) {}

  public generate(): string {
    const tempo: string = this.getTempo();
    const swing: string = this.getSwingMode();
    const groove: string = this.getGroove();
    const sections: string[] = this.getSections();
    const end = this.getEnd();

    const content = [tempo, swing, groove, ...sections, end].join("\n");

    return content;
  }

  private getTempo() {
    return `Tempo ${this.exercise.defaultConfig.bpm}`;
  }

  private getSwingMode() {
    return `SwingMode On`;
  }

  private getGroove() {
    return `Groove ${this.groove}`;
  }

  private getSections(): string[] {
    const measures: MeasureSchema[] = this.exercise.chordsGrid.sections.flatMap((section) => [
      ...section.commonMeasures,
      ...section.voltas.flatMap((v) => v.measures),
    ]);

    return measures.sort((a, b) => a.index - b.index).map((measure) => this.getMeasure(measure));
  }

  private getMeasure(measure: MeasureSchema) {
    const chordCells: Extract<Cell, { kind: "Chord" }>[] = measure.cells.filter(
      (c) => c.kind === "Chord"
    );
    const values = chordCells.map((cell) =>
      // `${cell.chord.content.note}${CHORDS_DICTIONNARY[cell.chord.content.modifier]?.mmaLabel ?? ""}`
      {
        if (cell.chord.content.note === "%") {
          return `/`;
        } else {
          return `${cell.chord.content.note}${CHORDS_DICTIONNARY[cell.chord.content.modifier]?.mmaLabel ?? ""}`;
        }
      }
    );
    const returnValue = `${measure.index} ${values.join(" ")}`;
    logger.info("Measure", returnValue);
    return returnValue;
  }

  private getEnd() {
    return "z";
  }
}
