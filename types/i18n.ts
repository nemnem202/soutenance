import LanguageEnum from "@/i18n/languages";

export type LanguageKey = keyof typeof LanguageEnum;

export type LanguageItem<L extends readonly LanguageKey[]> = Record<L[number], string>;

export type LanguagePack<L extends readonly LanguageKey[]> = Record<string, LanguageItem<L>>;

export type AvailableLanguages<L extends readonly LanguageKey[]> = L;
