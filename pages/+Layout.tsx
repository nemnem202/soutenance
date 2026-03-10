import { TooltipProvider } from "@/components/tooltip";
import LanguagesProvider from "@/providers/language-provider";
import SessionProvider from "@/providers/session-provider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <LanguagesProvider>
      <SessionProvider>
        <TooltipProvider>
          <div className="flex flex-col">{children}</div>
        </TooltipProvider>
      </SessionProvider>
    </LanguagesProvider>
  );
}
