import { ServerResponse, Status } from "@/types/server-response";
import { Controller, ControllerDeps } from "./Controller";
import { spawn } from "node:child_process";
import { logger } from "@/lib/logger";

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

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", ["../lib/process_music.py"]);

      let resultData = "";
      pythonProcess.stdout.on("data", (chunk) => {
        resultData += chunk;
      });

      pythonProcess.stdin.write(buffer);
      pythonProcess.stdin.end();

      pythonProcess.on("close", (code) => {
        if (code !== 0) return reject(new Error("Erreur Python"));

        const result = JSON.parse(resultData);
        const midiBuffer = Buffer.from(result.midi, "base64");
        logger.success("[MusicFileController] : files generated in ", Date.now() - time, "ms");
        resolve({
          success: true,
          status: Status.Ok,
          data: { json: result.chords, midiFile: midiBuffer },
        });
      });
    });
  }
}
