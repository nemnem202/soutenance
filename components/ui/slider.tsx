"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  color?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, color = "primary", ...props }, ref) => {
    const isVertical = props.orientation === "vertical";
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex touch-none select-none",
          isVertical ? "h-full flex-col items-center w-fit" : "w-full items-center",
          props.disabled && "opacity-50",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative grow overflow-hidden rounded-full bg-background border-popover border-1",
            isVertical ? "w-2 h-full" : "h-2 w-full"
          )}
        >
          <SliderPrimitive.Range
            className={cn(
              "absolute disabled:opacity-50",
              `bg-${color}`,
              isVertical ? "w-full bottom-0" : "h-full"
            )}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={`cursor-pointer block h-3 w-3 rounded-full border-2 border-${color} bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${props.disabled && "!cursor-default"}`}
        />
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
