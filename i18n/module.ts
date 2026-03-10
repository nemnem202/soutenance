import { languagePack, availableLanguages } from "@/config/language-pack";
import { Language, LanguagePackKeys } from "@/types/i18n";

export default class I18nModule {
  private _currentLanguage: Language;
  private _undefinedValuePlaceholder: string;

  constructor(defaultLanguage: Language, undefinedValuePlaceholder = "Undefined") {
    this._currentLanguage = defaultLanguage;
    this._undefinedValuePlaceholder = undefinedValuePlaceholder;
  }

  public setCurrentLanguage(language: Language) {
    this._currentLanguage = language;
  }

  public getItem(key: LanguagePackKeys): string {
    const itemPack = languagePack[key];

    if (!itemPack) return "No item with this name is defined";

    return itemPack[this._currentLanguage] ?? this._undefinedValuePlaceholder;
  }

  getCurrentLanguage() {
    return this._currentLanguage;
  }
}
