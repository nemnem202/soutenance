import I18nModule from "@/i18n/module";
import { AvailableLanguages, LanguagePack } from "@/types/i18n";

const availableLanguages = ["french", "english", "spanish", "german", "chinese_simplified"] as const;

const languagePack: LanguagePack<typeof availableLanguages> = {
  homepageDefaultTitle: {
    french: "Bienvenue sur MusicSandbox !",
  },
  homepageSessionTitle,
};

const i18n = new I18nModule(availableLanguages, languagePack, "french");
