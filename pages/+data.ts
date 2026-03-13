import { getPreferredLanguage } from "@/lib/utils";
import { ScreenSizeType } from "@/providers/screen-size-provider";
import { Account } from "@/types/account";
import { Exercice, Playlist } from "@/types/project";
import { PageContextServer } from "vike/types";
import { UAParser } from "ua-parser-js";

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

export async function data(pageContext: PageContextServer) {
  try {
    const acceptLanguage = pageContext.headers["accept-language"];
    const screen = getScreen(pageContext);
    const preferredLanguage = getPreferredLanguage(acceptLanguage);
    const res = await fetch("http://localhost:3000/placeholders");
    const { accounts, exercices, playlists } = (await res.json()) as {
      accounts: Account[];
      exercices: Exercice[];
      playlists: Playlist[];
    };
    return { accounts, exercices, playlists, preferredLanguage, screen };
  } catch (err) {
    console.error(err);
    return { accounts: [], exercices: [], playlists: [] };
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
