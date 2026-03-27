import { availableLanguages } from "@/config/language-pack";
import { Data } from "@/pages/+data";
import { Account } from "@/types/account";
import { Language } from "@/types/i18n";
import { Chord } from "@/types/music";
import { Exercice, Playlist } from "@/types/project";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useData } from "vike-react/useData";
import { keyof } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomAccount = (): Account => {
  const accounts = useData<Data>().accounts;
  const randomIndex = Math.floor(Math.random() * accounts.length);
  return accounts[randomIndex];
};

export const getRandomPlaylist = (): Playlist => {
  const playlists = useData<Data>().playlists;
  const randomIndex = Math.floor(Math.random() * playlists.length);
  return playlists[randomIndex];
};

export const getPreferredLanguage = (header: string | null): Language => {
  if (!header) return availableLanguages[0];

  const langs = header.split(",").map((part) => part.split(";")[0].trim());

  for (const lang of langs) {
    const base = lang.split("-")[0];
    if (availableLanguages.includes(lang as Language)) return lang as Language;
    if (availableLanguages.includes(base as Language)) return base as Language;
  }

  return availableLanguages[0];
};

export const chordToString = (chord: Chord) => `${chord.root} ${chord.harm?.symbolLabel ?? ""}`;
