import type React from "react";
import { createContext } from "react";
import type { availableLanguages } from "@/config/language-pack";
import { useLanguageProvider } from "@/hooks/use-language";
import type I18nModule from "@/i18n/module";

export const LanguagesContext = createContext<{
  instance: I18nModule;
  setLanguage: (language: (typeof availableLanguages)[number]) => void;
} | null>(null);

const LanguagesProvider = ({
  children,
  module,
}: {
  children: React.ReactNode;
  module?: I18nModule;
}) => {
  return (
    <LanguagesContext.Provider value={useLanguageProvider({ module })}>
      {children}
    </LanguagesContext.Provider>
  );
};

export default LanguagesProvider;
