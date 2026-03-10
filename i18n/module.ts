import { AvailableLanguages, LanguageItem, LanguageKey, LanguagePack } from "@/types/i18n";
import flags from "./flags";
import LanguageEnum from "./languages";
export default class I18nModule {
  private _currentLanguage: LanguageEnum = LanguageEnum.french;
  private _languagePack: LanguagePack = {};
  private _undefinedValuePlaceholder: string = "Undefined";
  private _availableLanguages: LanguageEnum[] = [];

  constructor(
    currentLanguage?: LanguageKey,
    availableLanguages?: AvailableLanguages,
    languagePack?: LanguagePack,
    undefinedValuePlaceholder?: string,
  ) {
    if (currentLanguage !== undefined) {
      this._currentLanguage = LanguageEnum[currentLanguage];
    }
    this._languagePack = languagePack ?? this._languagePack;
    this._undefinedValuePlaceholder = undefinedValuePlaceholder ?? this._undefinedValuePlaceholder;
    if (availableLanguages !== undefined) {
      this._availableLanguages = availableLanguages.map((a) => LanguageEnum[a]);
    }
  }

  public setCurrentLanguage(currentLanguage: LanguageKey) {
    this._currentLanguage = LanguageEnum[currentLanguage];
  }

  public getItem(withName: string): string {
    const itemPack: LanguageItem | undefined = this._languagePack[withName];

    if (!itemPack) return "No item with this name is defined";

    const itemValue = itemPack[this._currentLanguage];

    if (!itemValue) return this._undefinedValuePlaceholder;

    return itemValue;
  }

  public getAvailableLanguagesWithFlags() {
    return this._availableLanguages.map((language) => ({
      language: language,
      flagIcon: flags[language] && `https://purecatamphetamine.github.io/country-flag-icons/3x2/${flags[language]}.svg`,
    }));
  }

  getCurrentLanguage = () => this._currentLanguage;
}
