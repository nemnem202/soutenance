import { useContext } from "react";
import { ScreenSizeContext } from "@/providers/screen-size-provider";

export default function useScreen() {
  const context = useContext(ScreenSizeContext);
  if (!context) throw new Error("useScreen must be called insite it's provider !");
  return context;
}
