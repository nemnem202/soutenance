import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/molecules/tooltip";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: ReactNode }) {
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
