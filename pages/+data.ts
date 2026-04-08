import { faker } from "@faker-js/faker";
import { UAParser } from "ua-parser-js";
import type { PageContextServer } from "vike/types";
import { CHORDS_DICTIONNARY } from "@/config/chords-dictionary";
import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";
import { getPreferredLanguage } from "@/lib/utils";
import getCurrentUserFromCookie from "@/middlewares/getCurrentUser";
import type { ScreenSizeType } from "@/providers/screen-size-provider";
import type { Session } from "@/types/auth";
import { type ChordHarmony, Notes } from "@/types/music";
import type { Account, Exercise, Playlist } from "@/types/entities";

function getScreen(pageContext: PageContextServer): ScreenSizeType {
  const ua = pageContext.headers ? (pageContext.headers["user-agent"] ?? "") : "";
  const parser = new UAParser(ua);
  const device = parser.getDevice().type;
  if (device && ["mobile", "wearable", "embedded"].includes(device)) {
    return "sm";
  } else if (device === "tablet") {
    return "md";
  } else {
    return "lg";
  }
}

async function getAuthenticatedSession(cookieHeader: string | undefined): Promise<Session | null> {
  if (!cookieHeader) return null;
  const user = await getCurrentUserFromCookie(cookieHeader);
  if (!user) return null;
  const controller = new SessionController({ client: prismaClient });
  const response = await controller.getSession(user.id);
  if (response.success) {
    return response.data;
  } else {
    return null;
  }
}

const generatePlaceholders = () =>
  Array.from({ length: 20 }, (_, index) => {
    const root = faker.helpers.arrayElement(Notes);
    let harm: ChordHarmony | null = null;
    if (root !== "%") {
      const randomHarm = faker.helpers.arrayElement(Object.entries(CHORDS_DICTIONNARY));
      harm = randomHarm[1];
    }

    const tickStart = index * 480;
    const tickEnd = tickStart + faker.number.int({ min: 240, max: 960 });

    return {
      index,
      root,
      harm,
      tickStart,
      tickEnd,
    };
  });

export async function data(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);

  const preferredLanguage = getPreferredLanguage(pageContext.headers["accept-language"]);
  const screen = getScreen(pageContext);

  try {
    const res = await fetch("http://localhost:3000/placeholders");
    const { accounts, exercises, playlists } = (await res.json()) as {
      accounts: Account[];
      exercises: Exercise[];
      playlists: Playlist[];
    };

    return {
      session,
      accounts,
      exercises,
      playlists,
      preferredLanguage,
      screen,
      chordsPlaceholders: generatePlaceholders(),
    };
  } catch (err) {
    console.error("Failed to fetch page data:", err);
    return {
      session,
      accounts: [],
      exercises: [],
      playlists: [],
      chordsPlaceholders: generatePlaceholders(),
      preferredLanguage,
      screen,
    };
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
