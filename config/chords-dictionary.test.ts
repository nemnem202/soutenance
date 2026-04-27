import { describe, expect, it } from "vitest";
import { CHORDS_DICTIONNARY } from "./chords-dictionary";
import MidiController from "@/controllers/MidiController";
import prismaClient from "@/lib/prisma-client";

describe("Chords dictionnary", async () => {
  it("Generates a midi file with mma from all chords of chords dictionnary.", async () => {
    const chords = Object.entries(CHORDS_DICTIONNARY).map((value) => `C${value[1]?.mmaLabel}`);
    const content = ["Tempo 120", "Groove Ballad", ...chords].join("\n");
    const controller = new MidiController({ client: prismaClient });
    const response = await controller.generateMidiBuffer(content);

    expect(response).toBeDefined();
  });
});
