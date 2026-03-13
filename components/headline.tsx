import { ReactNode } from "react";

export default function Headline({ children }: { children: ReactNode }) {
  return <h1 className="headline md:mb-6">{children}</h1>;
}
