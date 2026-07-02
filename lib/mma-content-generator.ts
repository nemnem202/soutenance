import { findChordFromModifier } from "@/config/chords-dictionary";
import type { ExerciseWithForcedChordGrid } from "@/controllers/MidiController";
import type { Cell } from "@/types/music";
import type { MeasureSchema, SectionSchema, TimeSignatureSchema } from "@/types/entities";
import { MMA_GROOVES } from "@/config/grooves_dictionnary";
import type { MMAGrooveName } from "@/types/mma";
import { MMAGrooveTitle } from "./generated/prisma/enums";

export default class MMAContentGenerator {
  private usedFills: MMAGrooveName[] = [];
  private mmaMeasureIndex = 1;

  constructor(
    private readonly exercise: ExerciseWithForcedChordGrid,
    private readonly groove: MMAGrooveTitle
  ) {}

  public generate(): string {
    this.mmaMeasureIndex = 1;

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
    const sortedSections = [...this.exercise.chordsGrid.sections].sort((a, b) => a.index - b.index);

    const repeatableIndices = sortedSections
      .map((s, idx) => (s.type !== "Intro" && s.type !== "Outro" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    const firstRepeatableIdx = repeatableIndices.length > 0 ? repeatableIndices[0] : null;
    const lastRepeatableIdx =
      repeatableIndices.length > 0 ? repeatableIndices[repeatableIndices.length - 1] : null;

    return sortedSections.flatMap((section, idx) => {
      const groove = this.getGroove(section.type);
      const flatMeasures = this.unrollSectionMeasures(section);
      const renderedMeasures = this.renderFlatMeasures(flatMeasures, section);

      const sectionLines = [groove, ...renderedMeasures];

      if (idx === firstRepeatableIdx) {
        sectionLines.unshift("MIDImark LoopStart");
      }

      if (idx === lastRepeatableIdx) {
        sectionLines.push("MIDImark LoopEnd");
      }

      return sectionLines;
    });
  }

  private unrollSectionMeasures(section: SectionSchema): MeasureSchema[] {
    const flatMeasures: MeasureSchema[] = [];

    if (section.voltas.length > 0) {
      const sortedVoltas = [...section.voltas].sort((a, b) => a.index - b.index);
      const common = [...section.commonMeasures].sort((a, b) => a.index - b.index);

      if (sortedVoltas.length === 1) {
        const singleVolta = sortedVoltas[0];
        const voltaMeasures = [...singleVolta.measures].sort((a, b) => a.index - b.index);

        flatMeasures.push(...common);
        flatMeasures.push(...voltaMeasures);

        flatMeasures.push(...common);
        flatMeasures.push(...voltaMeasures);
      } else {
        sortedVoltas.forEach((volta) => {
          flatMeasures.push(...common);
          flatMeasures.push(...[...volta.measures].sort((a, b) => a.index - b.index));
        });
      }
    } else {
      const common = [...section.commonMeasures].sort((a, b) => a.index - b.index);
      let currentLoopStart = 0;

      for (const m of common) {
        if (m.bars.left === "loopOpen") {
          currentLoopStart = flatMeasures.length;
        }

        flatMeasures.push(m);

        if (m.bars.right === "loopClose") {
          const loopBody = flatMeasures.slice(currentLoopStart);
          flatMeasures.push(...loopBody);
          currentLoopStart = flatMeasures.length;
        }
      }
    }

    return flatMeasures;
  }

  private renderFlatMeasures(measures: MeasureSchema[], section: SectionSchema): string[] {
    return measures.flatMap((measure, index) => {
      const isLast = index === measures.length - 1;
      const lines: string[] = [];

      if (isLast) {
        const fill = this.getFill();
        if (fill) lines.push(fill);
      }

      lines.push(`MIDImark Bar_${measure.index}`);
      lines.push(this.getSingleMeasure(measure, this.mmaMeasureIndex));
      this.mmaMeasureIndex++;

      if (isLast) {
        const groove = this.getGroove(section.type);
        lines.push(groove);
      }

      return lines;
    });
  }

  private getSingleMeasure(measure: MeasureSchema, outIndex: number): string {
    const chordCells: Extract<Cell, { kind: "Chord" }>[] = measure.cells.filter(
      (c) => c.kind === "Chord"
    );
    const values = chordCells
      .sort((a, b) => a.index - b.index)
      .map((cell) => {
        if (cell.chord.content.note === "%") {
          return `/`;
        } else {
          const chord = findChordFromModifier(cell.chord.content.modifier);
          return `${cell.chord.content.note}${chord?.mmaLabel ?? ""}`;
        }
      });

    return `${outIndex} ${values.join(" ")}`;
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
    return "";
  }
}
