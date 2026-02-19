import { ReactNode } from "react";

export function ControlsSection({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 w-fit h-15 px-5 bg-card rounded-xl items-center select-none">{children}</div>;
}

export function IconButton({ children, onClick = () => {} }: { children: ReactNode; onClick?: () => any }) {
  return (
    <button onClick={onClick} className="all-unset cursor-pointer ">
      {children}
    </button>
  );
}
