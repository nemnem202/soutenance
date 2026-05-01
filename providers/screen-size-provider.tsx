import { createContext, type ReactNode, useEffect, useState } from "react";
import { useData } from "vike-react/useData";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type ScreenSizeType = keyof typeof BREAKPOINTS;

export type ScreenOrientationType = "horizontal" | "vertical";

export const ScreenSizeContext = createContext<
  { size: ScreenSizeType; orientation: ScreenOrientationType } | undefined
>(undefined);

export default function ScreenSizeProvider({ children }: { children: ReactNode }) {
  const data = useData<{ screen: ScreenSizeType }>();
  const { screen: screenSize } = data;

  const [size, setSize] = useState<ScreenSizeType>(() => {
    if (typeof window === "undefined") return screenSize;
    return getCurrentScreenSize();
  });

  const [orientation, setOrientation] = useState<ScreenOrientationType>(() => {
    if (typeof window !== "undefined") {
      return window.innerHeight > window.innerWidth ? "vertical" : "horizontal";
    }
    return "vertical";
  });

  function getCurrentScreenSize(): ScreenSizeType {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    const isMobileLandscape = isLandscape && height < 500;

    if (isMobileLandscape) return "sm";

    if (width >= BREAKPOINTS.xl) return "xl";
    if (width >= BREAKPOINTS.lg) return "lg";
    if (width >= BREAKPOINTS.md) return "md";
    return "sm";
  }

  function screenToOrientation(orientation: OrientationType): ScreenOrientationType {
    switch (orientation) {
      case "landscape-primary":
      case "landscape-secondary":
        return "horizontal";
      case "portrait-primary":
      case "portrait-secondary":
        return "vertical";
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: qsdqsd
  useEffect(() => {
    const handler = () => {
      setSize(getCurrentScreenSize());
      setOrientation(window.innerHeight > window.innerWidth ? "vertical" : "horizontal");
    };

    if (screen?.orientation) {
      setOrientation(screenToOrientation(screen.orientation.type));

      const orientHandler = () => {
        setOrientation(screenToOrientation(screen.orientation.type));
      };

      screen.orientation.addEventListener("change", orientHandler);
      window.addEventListener("resize", handler);

      return () => {
        screen.orientation.removeEventListener("change", orientHandler);
        window.removeEventListener("resize", handler);
      };
    }
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ size, orientation }}>
      {children}
    </ScreenSizeContext.Provider>
  );
}
