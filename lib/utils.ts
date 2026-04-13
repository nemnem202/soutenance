import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { availableLanguages } from "@/config/language-pack";
import type { Language } from "@/types/i18n";
import type { Chord } from "@/types/music";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const chordToString = (chord: Chord) =>
  `${chord.content.note} ${chord.content.modifier ?? ""} ${chord.over && `${chord.over.note} ${chord.over.modifier}`}`;
