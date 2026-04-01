import { useContext, useEffect, useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { availableLanguages } from "@/config/language-pack";
import I18nModule from "@/i18n/module";
import type { Data } from "@/pages/+data";
import { LanguagesContext } from "@/providers/language-provider";
import type { Language } from "@/types/i18n";

export function useLanguageProvider({ module }: { module?: I18nModule }) {
  const preferredLanguage = useData<Data>().preferredLanguage ?? "en";
  const DEFAULT_MODULE = new I18nModule(preferredLanguage as Language);

  const [currentLanguage, setCurrentLanguage] = useState<
    (typeof availableLanguages)[number]
  >(module?.getCurrentLanguage() ?? DEFAULT_MODULE.getCurrentLanguage());

  const instance = useMemo(() => {
    const m = module ?? DEFAULT_MODULE;
    m.setCurrentLanguage(currentLanguage);
    return m;
  }, [module, currentLanguage, DEFAULT_MODULE]);

  const setLanguage = (language: (typeof availableLanguages)[number]) => {
    setCurrentLanguage(language);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: qsqds
  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferred-language");
    if (
      preferredLanguage &&
      availableLanguages.includes(preferredLanguage as Language)
    )
      setLanguage(preferredLanguage as Language);
  }, []);

  return { instance, setLanguage };
}

export function useLanguage() {
  const languageData = useContext(LanguagesContext);
  if (!languageData)
    throw new Error("use language must be called inside it's provider.");
  return languageData;
}
