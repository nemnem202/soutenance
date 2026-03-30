import { type ReactNode, useId } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function SwitchParam({
  checked,
  setChecked,
  children,
  order = "switch-label",
  disabled = false,
}: {
  checked: boolean;
  setChecked: (value: boolean) => void;
  children: ReactNode;
  order?: "switch-label" | "label-switch";
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="w-min">
      <div
        className={`flex items-center gap-2 ${order === "label-switch" && "flex-row-reverse"} ${!checked && "text-muted-foreground"} `}
      >
        <Switch
          disabled={disabled}
          defaultChecked={checked}
          onClick={(e) => {
            e.stopPropagation();
            setChecked(!checked);
          }}
          id={id}
        />
        <Label
          htmlFor={id}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </Label>
      </div>
    </div>
  );
}
