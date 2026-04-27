import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import type { ExerciseWithForcedChordGrid } from "@/controllers/MidiController";
import type { Cell } from "@/types/music";
import { logger } from "./logger";
import type { MeasureSchema, SectionSchema } from "@/types/entities";
import { MMA_GROOVES } from "@/config/grooves_dictionnary";
import { MMAGrooveName, MMAGrooveTitle } from "@/types/mma";

export default class MMAContentGenerator {
  private usedFills: MMAGrooveName[] = [];
  constructor(
    private readonly exercise: ExerciseWithForcedChordGrid,
    private readonly groove: MMAGrooveTitle
  ) {}

  public generate(): string {
    const tempo: string = this.getTempo();
    const swing: string = this.getSwingMode();
    const sections: string[] = this.getSections();
    const end = this.getEnd();

    const content = [tempo, swing, ...sections, end].join("\n");

    return content;
  }

  private getTempo() {
    return `Tempo ${this.exercise.defaultConfig.bpm}`;
  }

  private getSwingMode() {
    return `SwingMode Off`;
  }

  private getGroove(sectionType: SectionSchema["type"]): string {
    const config = MMA_GROOVES.get(this.groove);

    if (!config) {
      return `Groove ${this.groove}`;
    }

    let selectedGroove: string | null = null;

    switch (sectionType) {
      case "Intro":
        selectedGroove =
          config.intros.default ?? config.intros.A ?? config.intros.B ?? config.intros.C;
        break;

      case "Outro":
        selectedGroove =
          config.endings.default ?? config.endings.A ?? config.endings.B ?? config.endings.C;
        break;

      case "A":
      case "Verse":
      case "Melody":
        selectedGroove = config.sections.A ?? config.sections.default;
        break;
      case "B":
      case "Refrain":
      case "Bridge":
        selectedGroove = config.sections.plus ?? config.sections.B ?? config.sections.default;
        break;
      case "C":
      case "Solo":
        selectedGroove = config.sections.C ?? config.sections.default;
        break;
      case "D":
        selectedGroove = config.sections.D ?? config.sections.default;
        break;

      default:
        selectedGroove = config.sections.default ?? config.sections.A;
        break;
    }

    return `Groove ${selectedGroove ?? this.groove}`;
  }

  private getSections(): string[] {
    const sections = this.exercise.chordsGrid.sections.flatMap((section) => {
      const groove = this.getGroove(section.type);
      const measures = this.getMeasures(section);

      return [groove, ...measures];
    });

    return sections;
  }

  private getMeasures(section: SectionSchema): string[] {
    const measuresSchemas: MeasureSchema[] = [
      ...section.commonMeasures,
      ...section.voltas.flatMap((v) => v.measures),
    ];

    return measuresSchemas
      .sort((a, b) => a.index - b.index)
      .flatMap((measure, index) => {
        const isLast = index === measuresSchemas.length - 1;
        const measureLine = this.getSingleMeasure(measure, isLast ? "isLast" : undefined);

        if (isLast) {
          const fill = this.getFill();
          // On retourne un tableau [Fill, Mesure] sans le "..." devant measureLine
          return fill ? [fill, measureLine] : [measureLine];
        }

        return [measureLine];
      });
  }

  private getSingleMeasure(measure: MeasureSchema, isLast?: "isLast"): string {
    const chordCells: Extract<Cell, { kind: "Chord" }>[] = measure.cells.filter(
      (c) => c.kind === "Chord"
    );
    const values = chordCells.map((cell) => {
      if (cell.chord.content.note === "%") {
        return `/`;
      } else {
        return `${cell.chord.content.note}${CHORDS_DICTIONNARY[cell.chord.content.modifier]?.mmaLabel ?? ""}`;
      }
    });
    const returnValue = `${measure.index} ${values.join(" ")}`;
    logger.info("Measure", returnValue);
    return returnValue;
  }

  private getFill(): string | null {
    const config = MMA_GROOVES.get(this.groove);
    if (!config || !config.fills) {
      return null;
    }
    const allAvailableFills = Object.values(config.fills).filter(
      (f): f is MMAGrooveName => f !== null
    );

    if (allAvailableFills.length === 0) {
      return null;
    }
    let remainingFills = allAvailableFills.filter((fill) => !this.usedFills.includes(fill));
    if (remainingFills.length === 0) {
      this.usedFills = [];
      remainingFills = allAvailableFills;
    }
    const selectedFill = remainingFills[0];
    this.usedFills.push(selectedFill);

    return `Groove ${selectedFill}`;
  }

  private getEnd() {
    return "z";
  }
}
