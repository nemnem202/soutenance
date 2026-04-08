import { ServerResponse, Status } from "@/types/server-response";
import { spawn } from "child_process";

export default class MidiController {
  public async getMidiFromChords(): Promise<ServerResponse<File>> {
    const buffer = await this.generateMidiBuffer("Tempo 120 \n Style Basic \n 1 C / G /");
    const uint8Array = new Uint8Array(buffer);
    const midiFile = new File([uint8Array], "track.mid", { type: "audio/midi" });
    return {
      success: true,
      status: Status.Ok,
      data: midiFile,
    };
  }

  private generateMidiBuffer(content: string) {
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const mma = spawn("bash", [
          "-c",
          `python3 /opt/mma/mma.py <(echo -e "${content}") /dev/stdout`,
        ]);
        const chunks: Buffer[] = [];
        const errors: Buffer[] = [];

        mma.on("error", (err) => {
          reject(new Error(`Failed to start MMA process: ${err.message}`));
        });

        mma.stdout.on("data", (chunk) => {
          chunks.push(chunk);
        });

        mma.stderr.on("data", (chunk) => {
          errors.push(chunk);
        });

        mma.on("close", (code) => {
          if (code === 0) {
            resolve(Buffer.concat(chunks));
          } else {
            const errorMsg = Buffer.concat(errors).toString();
            reject(new Error(`MMA Error (Code ${code}): ${errorMsg}`));
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
