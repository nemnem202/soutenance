import { createContext, type ReactNode, useEffect, useState } from "react";
import { useData } from "vike-react/useData";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type ScreenSizeType = keyof typeof BREAKPOINTS;

export const ScreenSizeContext = createContext<ScreenSizeType | undefined>(undefined);

export default function ScreenSizeProvider({ children }: { children: ReactNode }) {
  const data = useData<{ screen: ScreenSizeType }>();
  const { screen } = data;

  function getCurrentScreenSize(): ScreenSizeType {
    const width = window.innerWidth;

    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    return "sm";
  }

  const [size, setSize] = useState<ScreenSizeType>(() => {
    if (typeof window === "undefined") return screen;
    return getCurrentScreenSize();
  });

  useEffect(() => {
    const handler = () => {
      setSize(getCurrentScreenSize());
    };

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return <ScreenSizeContext.Provider value={size}>{children}</ScreenSizeContext.Provider>;
}
