import LanguageEnum from "@/i18n/languages";

type FullItem = Record<LanguageEnum, string>;

export type AvailableLanguages = LanguageKey[];

export type LanguageKey = keyof typeof LanguageEnum;

export type LanguageItem<L extends readonly LanguageKey[]> = Partial<Record<L[number], string>>;

export type LanguagePack<L extends readonly LanguageKey[]> = Record<string, LanguageItem<L>>;
