import { ServerResponse, Status } from "@/types/server-response";
import { Controller, ControllerDeps } from "./Controller";
import { spawn } from "node:child_process";
import { logger } from "@/lib/logger";
import { randomBytes } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";

export type JsonAndMidiOutput = {
  json: JSON;
  midiFile: Buffer;
};

interface FileDeps extends ControllerDeps {
  file: File;
}

export default class MusicFileController extends Controller {
  private file: File;
  constructor(deps: FileDeps) {
    super(deps);
    this.file = deps.file;
  }

  public async getJsonAndMidi(): Promise<ServerResponse<JsonAndMidiOutput>> {
    logger.info("[MusicFileController] : file submitted, ", this.file.name);
    const time = Date.now();
    const arrayBuffer = await this.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const mxlPath = `/tmp/${randomBytes(8).toString("hex")}.mxl`;
    await writeFile(mxlPath, buffer);

    try {
      const result = await new Promise<{ chords: unknown; midi: string }>((resolve, reject) => {
        const pythonProcess = spawn("python3", ["/app/lib/process_music.py", mxlPath]);

        let resultData = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (chunk) => {
          resultData += chunk;
        });
        pythonProcess.stderr.on("data", (chunk) => {
          errorData += chunk;
        });

        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            logger.error("Erreur Python stderr:", errorData);
            return reject(new Error(`Erreur Python (Code ${code}): ${errorData}`));
          }
          try {
            resolve(JSON.parse(resultData));
          } catch (e) {
            reject(new Error(`Erreur parsing JSON: ${e}`));
          }
        });

        pythonProcess.on("error", (err) => {
          reject(new Error(`Impossible de lancer le process Python: ${err.message}`));
        });
      });

      const midiBuffer = Buffer.from(result.midi, "base64");
      logger.success("[MusicFileController] : files generated in ", Date.now() - time, "ms");

      return {
        success: true,
        status: Status.Ok,
        data: { json: result.chords as JSON, midiFile: midiBuffer },
      };
    } finally {
      await unlink(mxlPath).catch(() => {});
    }
  }
}
