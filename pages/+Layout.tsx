import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/molecules/tooltip";
import { Toaster } from "@/components/ui/sonner";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";
import AudioProvider from "@/providers/audio-provider";

export default function Layout({ children }: { children: ReactNode }) {
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
