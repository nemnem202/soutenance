import { Account } from "@/types/account";
import { Exercice, Playlist } from "@/types/project";

export async function data() {
  try {
    const res = await fetch("http://localhost:3000/placeholders");
    const { accounts, exercices, playlists } = (await res.json()) as {
      accounts: Account[];
      exercices: Exercice[];
      playlists: Playlist[];
    };
    return { accounts, exercices, playlists };
  } catch (err) {
    console.error(err);
    return { accounts: [], exercices: [], playlists: [] };
  }
}

export type Data = Awaited<ReturnType<typeof data>>;
