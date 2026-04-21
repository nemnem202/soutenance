import type { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/molecules/tooltip";

export function SettingsParam({
  children,
  label,
  description,
  tooltip,
  id,
}: {
  children: ReactNode;
  label: string;
  id: string;
  description?: string;
  tooltip?: string;
}) {
  const labelEl = (
    <label htmlFor={id} className="flex flex-col cursor-pointer">
      <span className="paragraph font-medium text-foreground">{label}</span>
      {description && <span className="paragraph-sm text-muted-foreground">{description}</span>}
    </label>
  );

  return (
    <div className="flex items-center justify-between gap-6 px-5 py-3.5 border-b border-border last:border-b-0 bg-background">
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger asChild>{labelEl}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        labelEl
      )}
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export function SettingsSection({
  children,
  title,
  description,
  variant = "default",
}: {
  children: ReactNode;
  title: string;
  description?: string;
  variant?: "default" | "danger";
}) {
  const isDanger = variant === "danger";
  return (
    <section
      className={`w-full rounded-lg border overflow-hidden ${
        isDanger ? "border-destructive/40" : "border-border"
      }`}
    >
      <div
        className={`px-5 py-3.5 border-b ${
          isDanger ? "bg-destructive/5 border-destructive/30" : "bg-card border-border"
        }`}
      >
        <h2 className={`title-3 ${isDanger ? "text-destructive" : "text-foreground"}`}>{title}</h2>
        {description && <p className="paragraph-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

export function SettingsRow({
  children,
  label,
  description,
}: {
  children: ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-3.5 border-b border-border last:border-b-0 bg-background flex-wrap">
      <div className="flex flex-col">
        <span className="paragraph font-medium text-foreground whitespace-nowrap">{label}</span>
        {description && <span className="paragraph-sm text-muted-foreground">{description}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}
