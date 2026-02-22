import { TooltipProvider } from "@/components/tooltip";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
