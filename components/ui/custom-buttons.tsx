import { ArrowLeft, ChevronLeft, ChevronRight, Ellipsis, Heart, Plus } from "lucide-react";
import { Button, type ButtonProps } from "./button";

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
