import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/molecules/tooltip";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

export function SettingsParam({
  children,
  label,
  description,
  tooltip,
  id,
  orientation = "horizontal",
}: {
  children: ReactNode;
  label: string;
  id: string;
  orientation?: "vertical" | "horizontal";
  description?: string;
  tooltip?: string;
}) {
  const generateLabel = () => (
    <label className={`flex-1 flex flex-col`} htmlFor={id}>
      <p className="title-4 whitespace-nowrap">{label}</p>
      {description && (
        <p className="text-muted-foreground paragramh-md">{description}</p>
      )}
    </label>
  );
  return (
    <div
      className={`flex gap-4 w-fit h-fit items-center ${orientation === "vertical" && " flex-col !gap-0 items-start"}`}
    >
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger>{generateLabel()}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        generateLabel()
      )}
      {children}
    </div>
  );
}

export function SettingsSection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col w-full p-4 gap-4">
      <h2 className="title-2">{title}</h2>
      {children}
      <Separator orientation="horizontal" className="w-full" />
    </section>
  );
}
