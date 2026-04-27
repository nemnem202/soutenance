import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile, unlink } from "node:fs/promises";
import { logger } from "@/lib/logger";
import type { ChordsGridSchema, ExerciseSchema } from "@/types/entities";
import { Status, type ServerResponse } from "@/types/server-response";
import { Controller, type ControllerDeps } from "./Controller";
import GameRepository from "@/repositories/gameRepository";
import MMAContentGenerator from "@/lib/mma-content-generator";

export type ExerciseWithForcedChordGrid = ExerciseSchema & { chordsGrid: ChordsGridSchema };

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

    const content = new MMAContentGenerator(exercise, "BossaNova").generate();
    logger.info("Content: ", content);
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
}
