"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  color?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, color = "primary", ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        `relative flex w-full touch-none select-none items-center ${props.disabled && "opacity-50"}`,
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-popover">
        <SliderPrimitive.Range className={`absolute h-full  disabled:opacity-50 bg-${color}`} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={`cursor-pointer block h-3 w-3 rounded-full border-2 border-${color} bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${props.disabled && "!cursor-default"}`}
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
