import LanguageEnum from "@/i18n/languages";
import I18nModule from "@/i18n/module";
import React, { createContext, useMemo, useState } from "react";

const DEFAULT_MODULE = new I18nModule();

export const LanguagesContext = createContext<{
  instance: I18nModule;
  setLanguage: (language: LanguageEnum) => void;
} | null>(null);

const useLanguagesState = ({ module }: { module?: I18nModule }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageEnum>(
    module?.getCurrentLanguage() ?? DEFAULT_MODULE.getCurrentLanguage(),
  );

  const instance = useMemo(() => {
    const m = module ?? DEFAULT_MODULE;
    m.setCurrentLanguage(currentLanguage);
    return m;
  }, [module, currentLanguage]);

  const setLanguage = (language: LanguageEnum) => {
    setCurrentLanguage(language);
  };

  return { instance, setLanguage };
};

const LanguagesProvider = ({ children, module }: { children: React.ReactNode; module?: I18nModule }) => {
  return <LanguagesContext.Provider value={useLanguagesState({ module })}>{children}</LanguagesContext.Provider>;
};

export default LanguagesProvider;
