import { ServerResponse, Status } from "@/types/server-response";
import { spawn } from "child_process";
import { randomBytes } from "crypto";
import { readFile, unlink } from "fs/promises";
import { logger } from "@/lib/logger";

export default class MidiController {
  public async getMidiFromChords(): Promise<ServerResponse<Buffer>> {
    const start = Date.now();
    const content = [
      "Tempo 110",
      "SwingMode On",
      "Groove Ballad",
      "SeqSize 4",

      "Repeat",
      "1 Am7",
      "2 Dm7",
      "3 G7",
      "4 CM7",
      "5 FM7",
      "6 Bm7b5",
      "7 E7b9",
      "RepeatEnding 1",
      "Groove BalladFill", // fill activé seulement au dernier passage
      "8 Am7 / E7b9 /",
      "Groove Ballad", // on remet le groove normal pour la suite
      "RepeatEnd 2",

      "Groove BalladEnd",
      "9 Am7",
      "z",
    ].join("\n");
    const buffer = await this.generateMidiBuffer(content);
    logger.info(`Midi generated in ${Date.now() - start}ms`);
    return { success: true, status: Status.Ok, data: buffer };
  }

  private async generateMidiBuffer(content: string): Promise<Buffer> {
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

      mma.stdin.write(content + "\n");
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
