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
import type { Account, Exercise, Playlist } from "@/types/entities";
import { type ChordHarmony, Notes } from "@/types/music";

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

async function getSessionCookie(pageContext: PageContextServer): Promise<Session | null> {
  const cookie = pageContext.headers.cookie;
  const user = await getCurrentUserFromCookie(cookie);
  if (!user) return null;
  const session = await new SessionController({
    client: prismaClient,
    user,
  }).getSession();

  return session;
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
  try {
    const session = await getSessionCookie(pageContext);
    const acceptLanguage = pageContext.headers["accept-language"];
    const screen = getScreen(pageContext);
    const preferredLanguage = getPreferredLanguage(acceptLanguage);
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
    console.error(err);
    return {
      session: null,
      accounts: [],
      exercises: [],
      playlists: [],
      chordsPlaceholders: generatePlaceholders(),
    };
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
