import { TooltipProvider } from "@/components/tooltip";
import LanguagesProvider from "@/providers/language-provider";
import ScreenSizeProvider from "@/providers/screen-size-provider";
import SessionProvider from "@/providers/session-provider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ScreenSizeProvider>
      <LanguagesProvider>
        <SessionProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SessionProvider>
      </LanguagesProvider>
    </ScreenSizeProvider>
  );
}
