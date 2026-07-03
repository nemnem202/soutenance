import { ServerResponse, Status } from "@/types/server-response";
import { Controller, ControllerDeps } from "./Controller";
import { spawn } from "node:child_process";

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
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python3", ["process_music.py", "votre_fichier.musicxml"]);
      let data = "";

      pythonProcess.stdout.on("data", (chunk) => {
        data += chunk;
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) return reject(new Error("Erreur Python"));

        const result = JSON.parse(data);
        const midiBuffer = Buffer.from(result.midi, "base64");

        resolve({
          success: true,
          status: Status.Ok,
          data: { json: result.chords, midiFile: midiBuffer },
        });
      });
    });
  }
}
