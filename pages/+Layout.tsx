import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { Toaster } from "@/components/ui/sonner";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";
import AudioProvider from "@/providers/audio-provider";
import { logger } from "@/lib/logger";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    logger.warn(
      "✅ useEffect exécuté — si ce message apparaît UNE seule fois, StrictMode est désactivé"
    );
  }, []);
  return (
    <AudioProvider>
      <ScreenSizeProvider>
        <LanguagesProvider>
          <SessionProvider>
            <Toaster />
            <TooltipProvider>{children}</TooltipProvider>
          </SessionProvider>
        </LanguagesProvider>
      </ScreenSizeProvider>
    </AudioProvider>
  );
}
