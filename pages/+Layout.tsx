import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { Toaster } from "@/components/ui/sonner";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";
import AudioProvider from "@/providers/audio-provider";
import { logger } from "@/lib/logger";
import MidiProvider from "@/providers/midi-provider";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    logger.warn(
      "✅ useEffect exécuté — si ce message apparaît UNE seule fois, StrictMode est désactivé"
    );
    logger.warn("✅ Log effectué, ce log ne doit pas apparaitre dans la console en production");
  }, []);
  return (
    <AudioProvider>
      <ScreenSizeProvider>
        <LanguagesProvider>
          <SessionProvider>
            <MidiProvider>
              <Toaster />
              <TooltipProvider>{children}</TooltipProvider>
            </MidiProvider>
          </SessionProvider>
        </LanguagesProvider>
      </ScreenSizeProvider>
    </AudioProvider>
  );
}
