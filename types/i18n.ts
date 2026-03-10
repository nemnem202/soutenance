import LanguageEnum from "@/i18n/languages";

type FullItem = Record<LanguageEnum, string>;

export type LanguageItem = Partial<FullItem>;

export type LanguageKey = keyof typeof LanguageEnum;

export type AvailableLanguages = LanguageKey[];

export type LanguagePack = Record<string, LanguageItem>;
