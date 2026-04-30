import { findChordFromModifier } from "@/config/chords-dictionary";
import type { ExerciseWithForcedChordGrid } from "@/controllers/MidiController";
import type { Cell } from "@/types/music";
import type { MeasureSchema, SectionSchema, TimeSignatureSchema } from "@/types/entities";
import { MMA_GROOVES } from "@/config/grooves_dictionnary";
import type { MMAGrooveName, MMAGrooveTitle } from "@/types/mma";

export default class MMAContentGenerator {
  private usedFills: MMAGrooveName[] = [];
  constructor(
    private readonly exercise: ExerciseWithForcedChordGrid,
    private readonly groove: MMAGrooveTitle
  ) {}

  public generate(): string {
    const tempo: string = this.getTempo();
    const humanisation: string[] = this.getHumanisation();
    const sections: string[] = this.getSections();
    const timeSignature: string = this.getTimeSignature({
      top: this.exercise.defaultConfig.timeSignatureTop,
      bottom: this.exercise.defaultConfig.timeSignatureBottom,
    });
    const end = this.getEnd();

    const content = [tempo, timeSignature, ...humanisation, ...sections, end].join("\n");

    return content;
  }

  private getTimeSignature(timeSig: TimeSignatureSchema) {
    return `Time ${timeSig.top}/${timeSig.bottom}`;
  }

  private getTempo() {
    return `Tempo ${this.exercise.defaultConfig.bpm}`;
  }

  private getHumanisation(): string[] {
    return [`SwingMode Off`, "AllTracks RVolume 80", "AllTracks RTime 80"];
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
      const repeat = section.voltas.length > 0 ? ["Repeat"] : [];

      const measures = this.getMeasures(section);

      const timeSignature: string = this.getTimeSignature({
        top: this.exercise.defaultConfig.timeSignatureTop,
        bottom: this.exercise.defaultConfig.timeSignatureBottom,
      });

      return [
        groove,
        //  timeSignature,
        ...repeat,
        ...measures,
      ];
    });

    return sections;
  }

  private getMeasures(section: SectionSchema): string[] {
    const hasVoltas = section.voltas.length > 0;

    if (hasVoltas) {
      const commonLines = this.renderMeasureList(section.commonMeasures, section, false, true);

      const sortedVoltas = [...section.voltas].sort((a, b) => a.volta - b.volta);

      const voltaLines = sortedVoltas.flatMap((volta, i) => {
        const isLastVolta = i === sortedVoltas.length - 1;
        const measures = this.renderMeasureList(volta.measures, section, isLastVolta, true);
        return [`RepeatEnding`, ...measures];
      });

      return [...commonLines, ...voltaLines, `RepeatEnd 0`];
    }

    return this.renderMeasureList(section.commonMeasures, section, true, false);
  }

  private renderMeasureList(
    measures: MeasureSchema[],
    section: SectionSchema,
    withFill: boolean,
    ignoreRepeatBars: boolean
  ): string[] {
    const sorted = [...measures].sort((a, b) => a.index - b.index);

    return sorted.flatMap((measure, index) => {
      const isLast = index === sorted.length - 1;
      const lines: string[] = [];

      if (!ignoreRepeatBars && measure.bars.left === "loopOpen") {
        lines.push("Repeat");
      }

      if (isLast && withFill) {
        const fill = this.getFill();
        // const timeSignature: string = this.getTimeSignature({
        //   top: this.exercise.defaultConfig.timeSignatureTop,
        //   bottom: this.exercise.defaultConfig.timeSignatureBottom,
        // });
        if (fill) lines.push(fill);
      }

      lines.push(this.getSingleMeasure(measure, isLast && withFill ? "isLast" : undefined));

      if (isLast && withFill) {
        const groove = this.getGroove(section.type);
        lines.push(groove);
      }

      if (!ignoreRepeatBars && measure.bars.right === "loopClose") {
        lines.push("RepeatEnd");
      }

      return lines;
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
        const chord = findChordFromModifier(cell.chord.content.modifier);
        return `${cell.chord.content.note}${chord?.mmaLabel ?? ""}`;
      }
    });
    const returnValue = `${measure.index} ${values.join(" ")}`;
    return returnValue;
  }

  private getFill(): string | null {
    const config = MMA_GROOVES.get(this.groove);
    if (!config?.fills) {
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
    // return "z";
    return "";
  }
}
