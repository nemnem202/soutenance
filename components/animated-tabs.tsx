"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useCallback, useId, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import UpcomingToolTip from "./upcoming-tooltip";

export interface AnimatedTabsProps {
  tabs: { id: string; label: string; icon?: ReactNode; disabled?: boolean }[];
  activeTab?: string;
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "underline" | "pill" | "segment";
  layoutId?: string;
  className?: string;
}

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.05,
};

export default function AnimatedTabs({ ...props }: AnimatedTabsProps) {
  const {
    tabs,
    activeTab: controlledActiveTab,
    defaultTab,
    onChange,
    variant = "underline",
    layoutId: customLayoutId,
    className,
  } = props;
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const layoutId = customLayoutId ?? `animated-tabs-${generatedId}`;

  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab?.disabled) return;
      if (!isControlled) {
        setInternalActiveTab(tabId);
      }
      onChange?.(tabId);
    },
    [isControlled, onChange],
  );

  const baseContainerStyles = cn(
    "relative inline-flex",
    variant === "underline" && "gap-1 border-border border-b",
    variant === "pill" && "gap-1 rounded-md bg-card p-1.5",
    variant === "segment" && "gap-0 rounded-lg bg-card p-1.5",
  );

  return (
    <div aria-label="Tabs" className={cn(baseContainerStyles, className)} role="tablist">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return tab.disabled ? (
          <UpcomingToolTip key={index}>
            <span>
              <TabButton
                {...tab}
                {...props}
                isActive={isActive}
                index={index}
                handleTabChange={handleTabChange}
                shouldReduceMotion={shouldReduceMotion}
              />
            </span>
          </UpcomingToolTip>
        ) : (
          <TabButton
            key={index}
            {...tab}
            {...props}
            isActive={isActive}
            index={index}
            handleTabChange={handleTabChange}
            shouldReduceMotion={shouldReduceMotion}
          />
        );
      })}
    </div>
  );
}

function TabButton({
  ...props
}: AnimatedTabsProps & {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  isActive: boolean;
  index: number;
  handleTabChange: (id: string) => void;
  shouldReduceMotion: boolean | null;
}) {
  const { id, label, tabs, disabled, icon, layoutId, variant, isActive, index, handleTabChange, shouldReduceMotion } =
    props;

  const getTabStyles = (isActive: boolean, disabled?: boolean) =>
    cn(
      "relative z-10 flex items-center justify-center gap-2 px-4 py-2 font-medium text-sm transition-colors",
      disabled ? "text-muted-foreground opacity-60" : "cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      variant === "underline" && [
        "rounded-t-md",
        disabled
          ? "text-muted-foreground"
          : isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
      ],
      variant === "pill" && [
        "rounded-md",
        disabled
          ? "text-muted-foreground"
          : isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
      ],
      variant === "segment" && [
        "flex-1 rounded-md",
        disabled
          ? "text-muted-foreground"
          : isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
      ],
    );

  const getIndicatorStyles = () =>
    cn(
      "absolute",
      variant === "underline" && "right-0 -bottom-px left-0 h-0.5 bg-primary",
      variant === "pill" && "inset-0 rounded-sm bg-primary shadow-sm",
      variant === "segment" && "inset-0 rounded-md border border-border bg-primary shadow-sm",
    );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        newIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      let newTab = tabs[newIndex];

      while (newTab?.disabled) {
        newIndex = (newIndex + 1) % tabs.length;
        newTab = tabs[newIndex];
      }
      if (newTab) {
        handleTabChange(newTab.id);
        const tabElement = document.getElementById(`${layoutId}-tab-${newTab.id}`);
        tabElement?.focus();
      }
    },
    [tabs, handleTabChange, layoutId],
  );
  return (
    <button
      aria-selected={isActive}
      className={getTabStyles(isActive, disabled)}
      id={`${layoutId}-tab-${id}`}
      disabled={disabled}
      onClick={() => !disabled && handleTabChange(id)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      role="tab"
      tabIndex={disabled ? -1 : isActive ? 0 : -1}
      type="button"
    >
      {isActive && (
        <motion.span
          className={getIndicatorStyles()}
          layout
          layoutId={layoutId}
          style={{ originY: "0px" }}
          transition={shouldReduceMotion ? { duration: 0 } : SPRING}
        />
      )}
      {icon && <span className="relative z-10">{icon}</span>}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
