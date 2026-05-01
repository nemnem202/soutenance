import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Maximize, Minimize } from "lucide-react";
import { type ComponentProps, type ReactNode, useId, useState } from "react";
import {
  CustomInputGroupInput,
  InputGroup,
  InputGroupAddon,
} from "@/components/molecules/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/molecules/tooltip";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import useScreen from "@/hooks/use-screen";
import useGame from "@/hooks/use-game";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/organisms/select";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action } from "@/midi-editor/types/actions";

export function ControlsSection({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 w-fit h-12 px-5 bg-card rounded-md items-center select-none">
      {children}
    </div>
  );
}

export function SidebarTabButton({
  text,
  isActive,
  onClick = () => {},
  props = {},
  disabled = false,
}: {
  text: string;
  isActive: boolean;
  onClick?: () => void;
  props?: ButtonProps;
  disabled?: boolean;
}) {
  return (
    <Button
      className={`bg-transparent text-[0.885rem] font-bold md:text-[1.115rem] h-8 md:h-12 text-foreground flex items-center justify-start text-left hover:bg-popover p-2 rounded ${isActive && "text-primary fill-primary transition"}`}
      onClick={onClick}
      {...props}
    >
      {text}
      {disabled && (
        <span className="paragraph-sm text-muted-foreground ml-5 hidden md:block">upcoming</span>
      )}
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
  const isMobile = useScreen().size === "sm";
  if (tooltip && !isMobile) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex flex-col gap-2 p-1 ${containerClassName}`}>
            <Label className="paragraph-sm cursor-pointer !text-left" htmlFor={id}>
              {label}
            </Label>
            <InputGroup className="w-full border-none !bg-popover h-full !rounded-xs">
              <CustomInputGroupInput
                id={id}
                {...props}
                className={`paragraph-sm h-6 full !rounded-xs text-left! ${!icon && "pl-1"}`}
              />
              {icon ? (
                <InputGroupAddon align={align} className="pl-1">
                  {icon}
                </InputGroupAddon>
              ) : (
                <InputGroupAddon align={align} />
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
          <CustomInputGroupInput
            id={id}
            {...props}
            className={`paragraph-sm h-6 full !rounded-xs text-left! ${!icon && "pl-1"}`}
          />
          {icon ? (
            <InputGroupAddon align={align} className="pl-1">
              {icon}
            </InputGroupAddon>
          ) : (
            <InputGroupAddon align={align} />
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
      <Label htmlFor={id} className={`paragraph ${labelProps?.className}`} {...labelProps}>
        {label}
      </Label>
      <Checkbox id={id} {...checkboxProps} />
    </div>
  );
}

export function FullScreenButton({
  fullScreen,
  setFullScreen,
}: {
  fullScreen: boolean;
  setFullScreen: (full: boolean) => void;
}) {
  return (
    <Button variant={"ghost"} onClick={() => setFullScreen(!fullScreen)}>
      {fullScreen ? (
        <Minimize className=" stroke-muted-foreground !hover:stroke-foreground" />
      ) : (
        <Maximize className=" stroke-muted-foreground !hover:stroke-foreground" />
      )}
    </Button>
  );
}

export function Tab({ children }: { children: ReactNode }) {
  const [fullScreen, setFullScreen] = useState(false);
  const { activeTab } = useGame();
  const interactiveProps = {
    role: "region",
    tabIndex: 0,
  };

  if (!fullScreen) {
    return (
      <div
        {...interactiveProps}
        className="size-full md:bg-card md:rounded-md relative overflow-hidden group min-h-0"
      >
        <div className="hidden md:block relative z-10">
          <div
            className={`absolute m-2 top-0 right-0 transition opacity-0 group-hover:opacity-100 flex gap-3`}
          >
            {activeTab === "piano-roll" && <TrackSelect />}

            <FullScreenButton fullScreen={fullScreen} setFullScreen={setFullScreen} />
          </div>
        </div>
        <div className="z-0 h-full min-h-0">{children}</div>
      </div>
    );
  } else {
    return (
      <div
        {...interactiveProps}
        className="inset-0 absolute top-0 left-0 z-100 bg-background group min-h-0"
      >
        <div className="relative z-10">
          <div
            className={`absolute m-2 top-0 right-0 transition opacity-0 group-hover:opacity-100 flex gap-3`}
          >
            {activeTab === "piano-roll" && <TrackSelect />}
            <FullScreenButton fullScreen={fullScreen} setFullScreen={setFullScreen} />
          </div>
        </div>
        <div className="z-0 h-full min-h-0">{children}</div>
      </div>
    );
  }
}

export function TrackSelect() {
  const { state, dispatch } = useMidiStore();

  if (!state) return;

  return (
    <Select
      defaultValue={String(state.currentTrackId)}
      onValueChange={(value) =>
        dispatch({
          type: Action.CHANGE_CURRENT_TRACK,
          trackId: parseInt(value, 10),
        })
      }
    >
      <SelectTrigger className="w-full max-w-35">
        <SelectValue className="text-left" />
      </SelectTrigger>
      <SelectContent className="z-200">
        <SelectGroup>
          {state.tracks.map((track) => (
            <SelectItem value={String(track.id)} key={track.id}>
              {track.instrument}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
