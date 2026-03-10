import { availableLanguages } from "@/config/language-pack";
import { useLanguageProvider } from "@/hooks/use-language";
import I18nModule from "@/i18n/module";
import React, { createContext } from "react";

export const LanguagesContext = createContext<{
  instance: I18nModule;
  setLanguage: (language: (typeof availableLanguages)[number]) => void;
} | null>(null);

const LanguagesProvider = ({ children, module }: { children: React.ReactNode; module?: I18nModule }) => {
  return <LanguagesContext.Provider value={useLanguageProvider({ module })}>{children}</LanguagesContext.Provider>;
};

export default LanguagesProvider;
