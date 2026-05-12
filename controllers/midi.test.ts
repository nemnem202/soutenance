import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CHORDS_DICTIONNARY } from "../config/chords-dictionary";
import MidiController from "@/controllers/MidiController";
import prismaClient from "@/lib/prisma-client";
import type { RegisterData } from "@/types/auth";
import fs from "node:fs";
import path from "node:path";
import { ConnexionController } from "./ConnexionController";
import { handleAction } from "@/lib/response-handler";
import getCurrentUserFromCookie from "@/middlewares/getCurrentUser";

let userData: RegisterData;
let userId: number | null = null;
let cookie: string | undefined;
beforeAll(async () => {
  const imagePath = path.resolve(process.cwd(), "assets/images/account-default-pic.webp");
  const buffer = fs.readFileSync(imagePath);
  const file = new File([buffer], "default.webp", { type: "image/webp" });

  userData = {
    username: "TestUser",
    agree_terms_of_service: true,
    email: "userTest@gmail.com",
    password: "123456789",
    password_confirm: "123456789",
    image: {
      file: file,
      alt: "The picture of testUser",
    },
  };

  const controller = new ConnexionController({
    client: prismaClient,
    user: null,
    setCookie: (name: string, value: string) => {
      cookie = `${name}=${value}`;
    },
  });
  const response = await handleAction("Register", () => controller.register(userData));

  const user = await getCurrentUserFromCookie(cookie!);
  userId = user?.id ?? null;
});

describe("Midi generation", async () => {
  it("Generates a midi file with mma from all chords of chords dictionnary.", async () => {
    const chords = Object.entries(CHORDS_DICTIONNARY).map((value) => `C${value[1]?.mmaLabel}`);
    const content = ["Tempo 120", "Groove Ballad", ...chords].join("\n");
    const controller = new MidiController({ client: prismaClient, user: { id: userId! } });
    const response = await controller.generateMidiBuffer(content);

    expect(response).toBeDefined();
  });
});

afterAll(async () => {
  // await prismaClient.user.deleteMany({
  //   where: {
  //     OR: [{ username: userData.username }],
  //   },
  // });
});
