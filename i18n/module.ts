import { LanguageKey, LanguagePack } from "@/types/i18n";

export default class I18nModule<L extends readonly LanguageKey[]> {
  private _currentLanguage: L[number];
  private _languagePack: LanguagePack<L>;
  private _availableLanguages: L;
  private _undefinedValuePlaceholder: string;

  constructor(
    availableLanguages: L,
    languagePack: LanguagePack<L>,
    defaultLanguage: L[number],
    undefinedValuePlaceholder = "Undefined",
  ) {
    this._availableLanguages = availableLanguages;
    this._languagePack = languagePack;
    this._currentLanguage = defaultLanguage;
    this._undefinedValuePlaceholder = undefinedValuePlaceholder;
  }

  public setCurrentLanguage(language: L[number]) {
    this._currentLanguage = language;
  }

  public getItem(withName: string): string {
    const itemPack = this._languagePack[withName];

    if (!itemPack) return "No item with this name is defined";

    return itemPack[this._currentLanguage] ?? this._undefinedValuePlaceholder;
  }

  getCurrentLanguage() {
    return this._currentLanguage;
  }
}
