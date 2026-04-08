import { useEffect, type ReactNode } from "react";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { Toaster } from "@/components/ui/sonner";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";
import { logger } from "@/lib/logger";
import onMidiFile from "@/telefunc/midifile.telefunc";

export default function Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    onMidiFile().then((response) => {
      logger.info("Response", response);
    });
  }, []);
  return (
    <ScreenSizeProvider>
      <LanguagesProvider>
        <SessionProvider>
          <Toaster />
          <TooltipProvider>{children}</TooltipProvider>
        </SessionProvider>
      </LanguagesProvider>
    </ScreenSizeProvider>
  );
}
