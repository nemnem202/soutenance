import { ServerResponse, Status } from "@/types/server-response";
import { Controller, ControllerDeps } from "./Controller";
import { spawn } from "node:child_process";
import { logger } from "@/lib/logger";
import { randomBytes } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import { AppError } from "@/lib/errors";

const ALLOWED_EXTENSIONS = new Set([
  ".xml",
  ".mxl",
  ".musicxml",
  ".mid",
  ".midi",
  ".abc",
  ".krn",
  ".mei",
]);

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function isValidZip(buffer: Buffer): boolean {
  // .mxl est un zip, signature PK\x03\x04
  return buffer.length > 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function isLikelyXml(buffer: Buffer): boolean {
  const start = buffer.subarray(0, 200).toString("utf-8").trimStart();
  return (
    start.startsWith("<?xml") ||
    start.startsWith("<score-partwise") ||
    start.startsWith("<score-timewise")
  );
}

function isValidMidi(buffer: Buffer): boolean {
  // signature MIDI = "MThd"
  return buffer.length > 4 && buffer.subarray(0, 4).toString("ascii") === "MThd";
}

const magicChecks: Record<string, (b: Buffer) => boolean> = {
  ".mxl": isValidZip,
  ".mid": isValidMidi,
  ".midi": isValidMidi,
  ".xml": isLikelyXml,
  ".musicxml": isLikelyXml,
};

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
    this.applySecurity(buffer);
    return this.processFile(time, buffer);
  }

  private async processFile(
    time: number,
    buffer: Buffer
  ): Promise<ServerResponse<JsonAndMidiOutput>> {
    const ext = this.getExtension(this.file.name);
    const filePath = `/tmp/${randomBytes(8).toString("hex")}${ext}`;
    await writeFile(filePath, buffer);

    try {
      const result = await new Promise<{ exercise: any; midi: string }>((resolve, reject) => {
        const pythonProcess = spawn("python3", ["/app/lib/process_music.py", filePath]);

        let dataBuffer = "";
        let errorData = "";

        pythonProcess.stdout.on("data", (data) => {
          dataBuffer += data.toString();
        });
        pythonProcess.stderr.on("data", (chunk) => {
          errorData += chunk;
        });

        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            return reject(new Error(`Erreur Python (Code ${code}): ${errorData}`));
          }
          try {
            const parsed = JSON.parse(dataBuffer.trim());
            resolve(parsed); // Résout l'objet { exercise: ..., midi: ... }
          } catch (e) {
            reject(new Error(`Erreur parsing JSON: ${e}`));
          }
        });

        pythonProcess.on("error", (err) => {
          reject(new Error(`Impossible de lancer le process Python: ${err.message}`));
        });
      });

      logger.success("[MusicFileController] : files generated in ", Date.now() - time, "ms");

      return {
        success: true,
        status: Status.Ok,
        data: {
          json: result.exercise as JSON,
          midiFile: Buffer.from(result.midi, "base64"),
        },
      };
    } finally {
      await unlink(filePath).catch(() => {});
    }
  }

  private async applySecurity(buffer: Buffer) {
    const ext = this.getExtension(this.file.name);

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      logger.error(`[MusicFileController] : extension refusée: ${ext}`);
      return {
        success: false,
        status: Status.BadRequest, // adapte selon ton enum Status
        error: `Format de fichier non supporté: ${ext}`,
      };
    }

    if (this.file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        status: Status.BadRequest,
        error: `Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024} Mo)`,
      };
    }

    const check = magicChecks[ext];
    if (check && !check(buffer)) {
      throw new AppError(Status.BadRequest, "Invalid file");
    }
  }

  private getExtension(filename: string): string {
    const idx = filename.lastIndexOf(".");
    return idx === -1 ? "" : filename.slice(idx).toLowerCase();
  }
}
