import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export default function UpcomingToolTip({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={"top"}>
          <p className="paragraph-xs ">Upcoming</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
