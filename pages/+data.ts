import { getPreferredLanguage } from "@/lib/utils";
import { Account } from "@/types/account";
import { Exercice, Playlist } from "@/types/project";
import { PageContextServer } from "vike/types";

export async function data(pageContext: PageContextServer) {
  try {
    const acceptLanguage = pageContext.headers["accept-language"];
    const preferredLanguage = getPreferredLanguage(acceptLanguage);
    const res = await fetch("http://localhost:3000/placeholders");
    const { accounts, exercices, playlists } = (await res.json()) as {
      accounts: Account[];
      exercices: Exercice[];
      playlists: Playlist[];
    };
    return { accounts, exercices, playlists, preferredLanguage };
  } catch (err) {
    console.error(err);
    return { accounts: [], exercices: [], playlists: [] };
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
