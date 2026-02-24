import { TooltipProvider } from "@/components/tooltip";
import SessionProvider from "@/providers/session-provider";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </SessionProvider>
  );
}
