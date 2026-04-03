import type { ReactNode } from "react";
import useScreen from "@/hooks/use-screen";

export default function SizeAdapter({ sm, md }: { sm?: ReactNode; md?: ReactNode }) {
  const size = useScreen();

  if (size === "sm") {
    return sm;
  } else {
    return md;
  }
}
