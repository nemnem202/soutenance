import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Ellipsis,
  Heart,
  Pause,
  Play,
  Plus,
  Settings,
  Square,
  X,
  Timer,
  ZoomIn,
  ZoomOut,
  Minimize,
  Maximize,
} from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { useLanguage } from "@/hooks/use-language";
import useGame from "@/hooks/use-game";
import { Action } from "@/midi-editor/types/actions";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";

export function LikeButton({ liked = false, ...props }: ButtonProps & { liked?: boolean }) {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      {...props}
      className={`rounded-full ${props.className}`}
    >
      <Heart className={`${liked && "stroke-destructive fill-destructive"}`} />
    </Button>
  );
}

export function MenuButton({ ...props }: ButtonProps) {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      {...props}
      className={`rounded-full ${props.className}`}
    >
      <Ellipsis className="h-4 w-4" />
    </Button>
  );
}

export function PlusButton({ ...props }: ButtonProps) {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      {...props}
      className={`rounded-full ${props.className}`}
    >
      <Plus />
    </Button>
  );
}

export function ChevronLeftButton({ ...props }: ButtonProps) {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      {...props}
      className={`rounded-full ${props.className}`}
    >
      <ChevronLeft />
    </Button>
  );
}

export function ChevrontRightButton({ ...props }: ButtonProps) {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      {...props}
      className={`rounded-full ${props.className}`}
    >
      <ChevronRight />
    </Button>
  );
}

export function HistoryBackButton() {
  return (
    <button type="button" onClick={() => window.history.back()} className="cursor-pointer">
      <ArrowLeft />
    </button>
  );
}

export function ShowAllButton({ ...props }: ButtonProps) {
  const { instance } = useLanguage();
  return (
    <button
      type="button"
      className="text-muted-foreground flex flex-row justify-center transition hover:text-foreground cursor-pointer"
      {...props}
    >
      {instance.getItem("show_all")} <ChevronDown />
    </button>
  );
}

export function ShowLessButton({ ...props }: ButtonProps) {
  const { instance } = useLanguage();
  return (
    <button
      type="button"
      className="text-muted-foreground flex flex-row justify-center transition hover:text-foreground cursor-pointer"
      {...props}
    >
      {instance.getItem("show_less")} <ChevronUp />
    </button>
  );
}

export function CloseButton({ ...props }: ButtonProps) {
  const { instance } = useLanguage();
  return (
    <button
      type="button"
      className="text-muted-foreground flex flex-row justify-center transition hover:text-foreground cursor-pointer"
      {...props}
    >
      <X />
    </button>
  );
}

function IconButton({ ...props }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      className="[&>svg]:w-auto [&>svg]:h-auto [&>svg]:shrink 
      fill-foreground stroke-foreground 
      hover:fill-primary hover:stroke-primary
      hover:!bg-transparent !bg-transparent
      "
      {...props}
    />
  );
}

export function PlayButton({ ...props }: ButtonProps) {
  const { dispatch, state } = useMidiStore();
  const handlePlay = () => {
    if (state?.transport.status === "playing") {
      dispatch({ type: Action.SET_TRANSPORT_STATUS, status: "paused" });
    } else {
      dispatch({ type: Action.SET_TRANSPORT_STATUS, status: "playing" });
    }
  };
  return (
    <IconButton {...props} onClick={() => handlePlay()}>
      {state?.transport.status === "playing" ? (
        <Pause className="fill-inherit stroke-inherit" />
      ) : (
        <Play className="fill-inherit stroke-inherit" />
      )}
    </IconButton>
  );
}

export function MetronomeButton({ ...props }: ButtonProps) {
  return (
    <IconButton {...props}>
      <Timer />
    </IconButton>
  );
}

export function StopButton({ ...props }: ButtonProps) {
  const { dispatch } = useMidiStore();
  return (
    <IconButton
      {...props}
      onClick={() => dispatch({ type: Action.SET_TRANSPORT_STATUS, status: "reset" })}
    >
      <Square className="fill-inherit stroke-inherit" />
    </IconButton>
  );
}

export function SettingsButton({ ...props }: ButtonProps) {
  return (
    <IconButton {...props}>
      <Settings className="stroke-inherit" />
    </IconButton>
  );
}

export function ZoomInButton({ ...props }: ButtonProps) {
  return (
    <IconButton {...props}>
      <ZoomIn className="stroke-inherit" />
    </IconButton>
  );
}

export function ZoomOutButton({ ...props }: ButtonProps) {
  return (
    <IconButton {...props}>
      <ZoomOut className="stroke-inherit" />
    </IconButton>
  );
}

export function FullScreenButton({
  fullScreen,
  setFullScreen,
  className,
}: {
  fullScreen: boolean;
  setFullScreen: (full: boolean) => void;
  className?: string;
}) {
  return (
    <IconButton
      onClick={() => setFullScreen(!fullScreen)}
      className={`stroke-muted-foreground !hover:stroke-foreground  ${className}`}
    >
      {fullScreen ? <Minimize /> : <Maximize />}
    </IconButton>
  );
}
