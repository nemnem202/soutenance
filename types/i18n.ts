import { availableLanguages, languagePack } from "@/config/language-pack";

export type LanguageKey = keyof typeof LanguageEnum;

export type LanguageItem<L extends readonly LanguageKey[]> = Record<L[number], string>;

export type LanguagePack<L extends readonly LanguageKey[]> = Record<string, LanguageItem<L>>;

export type AvailableLanguages<L extends readonly LanguageKey[]> = L;

export type LanguagePackKeys = keyof typeof languagePack;

export type Language = (typeof availableLanguages)[number];
