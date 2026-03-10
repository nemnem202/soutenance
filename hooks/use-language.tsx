import { availableLanguages, languagePack } from "@/config/language-pack";
import I18nModule from "@/i18n/module";
import { LanguagesContext } from "@/providers/language-provider";
import { useContext, useMemo, useState } from "react";

const DEFAULT_MODULE = new I18nModule("spanish");

export function useLanguageProvider({ module }: { module?: I18nModule }) {
  const [currentLanguage, setCurrentLanguage] = useState<(typeof availableLanguages)[number]>(
    module?.getCurrentLanguage() ?? DEFAULT_MODULE.getCurrentLanguage(),
  );

  const instance = useMemo(() => {
    const m = module ?? DEFAULT_MODULE;
    m.setCurrentLanguage(currentLanguage);
    return m;
  }, [module, currentLanguage]);

  const setLanguage = (language: (typeof availableLanguages)[number]) => {
    setCurrentLanguage(language);
  };

  return { instance, setLanguage };
}

export function useLanguage() {
  const languageData = useContext(LanguagesContext);
  if (!languageData) throw new Error("use language must be called inside it's provider.");
  return languageData;
}
