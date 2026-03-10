import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function UpcomingToolTip({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent side={"top"}>
        <p className="paragraph-xs ">Upcoming</p>
      </TooltipContent>
    </Tooltip>
  );
}
