import { ComponentProps, ReactNode, useId, useState } from "react";
import { Slider } from "../slider";
import { Label } from "../label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { Checkbox } from "../checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Button, ButtonProps } from "../button";
import { Maximize, Minimize } from "lucide-react";

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

export function SidebarTabButton({
  text,
  isActive,
  onClick = () => {},
  props = {},
}: {
  text: string;
  isActive: boolean;
  onClick?: () => void;
  props?: ButtonProps;
}) {
  return (
    <Button
      className={`title-3 h-12 flex items-center !justify-start gap-2 hover:bg-popover cursor-pointer !p-2 rounded bg-transparent ${isActive && "text-primary transition"}`}
      onClick={onClick}
      {...props}
    >
      {text}
    </Button>
  );
}

export function SidebarSlider({
  children,
  defaultValue,
  onValueChange = () => {},
  disabled = false,
}: {
  children: ReactNode;
  defaultValue: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}) {
  const [valueIsZero, setValueIsZero] = useState<boolean>(defaultValue === 0);
  const id = useId();
  return (
    <div className={`flex items-center gap-2 `}>
      <Label
        htmlFor={id}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </Label>
      <Slider
        defaultValue={[defaultValue]}
        max={100}
        step={1}
        onValueChange={(v) => {
          if (v[0] === 0 && !valueIsZero) {
            setValueIsZero(true);
          } else if (v[0] !== 0 && valueIsZero) {
            setValueIsZero(false);
          }
          onValueChange(v[0]);
        }}
        disabled={disabled}
        id={id}
      />
    </div>
  );
}

export function SmallInput({
  label,
  icon,
  align = "inline-start",
  containerClassName,
  tooltip,
  ...props
}: {
  label: string;
  containerClassName?: string;
  icon?: ReactNode;
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
  tooltip?: ReactNode;
} & ComponentProps<"input">) {
  const id = useId();
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex flex-col gap-2 p-1 ${containerClassName}`}>
            <Label className="paragraph-sm cursor-pointer !text-left" htmlFor={id}>
              {label}
            </Label>
            <InputGroup className="w-full border-none !bg-popover h-full !rounded-xs">
              <InputGroupInput
                id={id}
                {...props}
                className={`paragraph-sm h-6 full !rounded-xs text-left! ${!icon && "pl-1"}`}
              />
              {icon && (
                <InputGroupAddon align={align} className="pl-1">
                  {icon}
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  } else {
    return (
      <div className={`flex flex-col gap-2 p-1 ${containerClassName}`}>
        <Label className="paragraph-sm cursor-pointer" htmlFor={id}>
          {label}
        </Label>
        <InputGroup className="w-full border-none !bg-popover h-full !rounded-xs">
          <InputGroupInput
            id={id}
            {...props}
            className={`paragraph-sm h-6 full !rounded-xs text-left! ${!icon && "pl-1"}`}
          />
          {icon && (
            <InputGroupAddon align={align} className="pl-1">
              {icon}
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
    );
  }
}

export function SmallCheckboxGroup({
  label,
  checkboxProps,
  labelProps,
}: {
  label: string;
  checkboxProps?: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;
  labelProps?: ComponentProps<"label">;
}) {
  const id = useId();
  return (
    <div className="flex gap-2">
      <Label htmlFor={id} className={"paragaph " + labelProps?.className} {...labelProps}>
        {label}
      </Label>
      <Checkbox id={id} {...checkboxProps} />
    </div>
  );
}

export function FullScreenButton({
  hover,
  fullScreen,
  setFullScreen,
}: {
  hover: boolean;
  fullScreen: boolean;
  setFullScreen: (full: boolean) => void;
}) {
  return (
    <div className={`absolute m-2 top-0 right-0 transition ${hover ? "opacity-100" : "opacity-0"}`}>
      <Button variant={"ghost"} onClick={() => setFullScreen(!fullScreen)}>
        {fullScreen ? (
          <Minimize className=" stroke-muted-foreground !hover:stroke-foreground" />
        ) : (
          <Maximize className=" stroke-muted-foreground !hover:stroke-foreground" />
        )}
      </Button>
    </div>
  );
}

export function Tab({ children }: { children: ReactNode }) {
  const [hover, setHover] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  if (!fullScreen) {
    return (
      <div
        className="size-full bg-card rounded-md relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FullScreenButton hover={hover} fullScreen={fullScreen} setFullScreen={setFullScreen} />
        {children}
      </div>
    );
  } else {
    return (
      <div
        className="inset-0 absolute top-0 left-0 z-100 bg-background"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <FullScreenButton hover={hover} fullScreen={fullScreen} setFullScreen={setFullScreen} />
        {children}
      </div>
    );
  }
}
