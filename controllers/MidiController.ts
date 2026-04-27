import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";
import { logger } from "@/lib/logger";
import type { ChordsGridSchema, ExerciseSchema, MeasureSchema } from "@/types/entities";
import type { Cell } from "@/types/music";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import { Status, type ServerResponse } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import GameRepository from "@/repositories/gameRepository";

type ExerciseWithForcedChordGrid = ExerciseSchema & { chordsGrid: ChordsGridSchema };

export default class MidiController extends Controller<ControllerDeps> {
  private repository = new GameRepository(this.deps.client);

  public async getMidiFile(
    exerciseId: number,
    userId: number | null
  ): Promise<ServerResponse<Buffer>> {
    const request = await this.repository.findOne(exerciseId, userId);
    if (!request.success) return request;
    if (!request.data.chordsGrid) throw new Error("Execises does not have chord grid");
    const file = await this.generateMidiFile(request.data as ExerciseWithForcedChordGrid);
    return {
      success: true,
      status: Status.Ok,
      data: file,
    };
  }

  private async generateMidiFile(
    exercise: ExerciseWithForcedChordGrid
  ): Promise<Buffer<ArrayBufferLike>> {
    const start = Date.now();
    const content = this.convertExerciseToMmaContent(exercise);
    logger.info("Content: ", content);
    // const content = [
    //   "Tempo 110",
    //   "SwingMode On",
    //   "Groove Ballad",
    //   "SeqSize 4",

    //   "Repeat",
    //   "1 A(add#9)",
    //   "2 DmM7(add9)",
    //   "3 Gsus(add#9)",
    //   "4 CM7",
    //   "5 FM7",
    //   "6 Bm7b5",
    //   "7 E7b9",
    //   "RepeatEnding 1",
    //   "Groove BalladFill",
    //   "8 Am7 / E7b9 /",
    //   "Groove Ballad",
    //   "RepeatEnd 2",

    //   "Groove BalladEnd",
    //   "9 Am7",
    //   "z",
    // ].join("\n");
    const buffer = await this.generateMidiBuffer(content);
    logger.success(`Midi generated in ${Date.now() - start}ms`);
    return buffer;
  }

  async generateMidiBuffer(content: string): Promise<Buffer> {
    const tempFilePath = `/tmp/mma_${randomBytes(8).toString("hex")}.mid`;

    try {
      await this.runMma(content, tempFilePath);
      return await readFile(tempFilePath);
    } finally {
      await unlink(tempFilePath).catch(() => {});
    }
  }

  private runMma(content: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const mma = spawn("python3", ["/opt/mma/mma.py", "-", "-f", outputPath], {
        env: { ...process.env, MMA_LIB_PATH: "/opt/mma/lib" },
      });

      const errors: Buffer[] = [];

      mma.stdin.write(`${content}\n`);
      mma.stdin.end();

      mma.stdout.on("data", (chunk: Buffer) => errors.push(chunk));
      mma.stderr.on("data", (chunk: Buffer) => errors.push(chunk));

      mma.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`MMA Error (Code ${code}): ${Buffer.concat(errors).toString()}`));
      });

      mma.on("error", (err) => reject(new Error(`Failed to start MMA: ${err.message}`)));
    });
  }

  private convertExerciseToMmaContent(exercise: ExerciseWithForcedChordGrid): string {
    const tempo: string = this.getTempo(exercise);
    const swing: string = this.getSwingMode(exercise);
    const groove: string = this.getGroove(exercise);
    const sections: string[] = this.getSections(exercise);
    const end = this.getEnd();

    const content = [tempo, swing, groove, ...sections, end].join("\n");

    return content;
  }

  private getTempo(exercise: ExerciseWithForcedChordGrid) {
    return `Tempo ${exercise.defaultConfig.bpm}`;
  }

  private getSwingMode(exercise: ExerciseWithForcedChordGrid) {
    return `SwingMode On`;
  }

  private getGroove(exercise: ExerciseWithForcedChordGrid) {
    return `Groove Ballad`;
  }

  private getSections(exercise: ExerciseWithForcedChordGrid): string[] {
    const measures: MeasureSchema[] = exercise.chordsGrid.sections.flatMap((section) => [
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
