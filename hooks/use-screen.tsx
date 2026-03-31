import { useContext } from "react";
import { ScreenSizeContext } from "@/providers/screen-size-provider";

export default function useScreen() {
  const size = useContext(ScreenSizeContext);
  if (!size) throw new Error("useScreen must be called insite it's provider !");
  return size;
}
