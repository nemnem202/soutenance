import type { ReactNode } from "react";

export default function MobileHeaderNavContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full p-2 pb-0 flex justify-between h-12 items-center">
      {children}
    </div>
  );
}
