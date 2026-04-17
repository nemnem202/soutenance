import type { ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Link({
  href,
  text,
  icon,
}: {
  href: string;
  text: string;
  icon?: ReactNode;
}) {
  const { urlPathname } = usePageContext();
  const isActive =
    href === "/" ? urlPathname === "/" : urlPathname === href || urlPathname.startsWith(href + "/");

  return (
    <a
      href={href}
      className={`title-3 h-12 flex items-center gap-2 hover:bg-popover p-2 rounded ${
        isActive ? "text-primary fill-primary transition" : ""
      }`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}
