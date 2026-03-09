import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function LikeButton({ ...props }: ButtonProps) {
  return (
    <Button variant={"ghost"} size={"icon"} {...props} className={"rounded-full " + props.className}>
      <Heart />
    </Button>
  );
}

export function PlusButton({ ...props }: ButtonProps) {
  return (
    <Button variant={"ghost"} size={"icon"} {...props} className={"rounded-full " + props.className}>
      <Plus />
    </Button>
  );
}

export function ChevronLeftButton({ ...props }: ButtonProps) {
  return (
    <Button variant={"ghost"} size={"icon"} {...props} className={"rounded-full " + props.className}>
      <ChevronLeft />
    </Button>
  );
}

export function ChevrontRightButton({ ...props }: ButtonProps) {
  return (
    <Button variant={"ghost"} size={"icon"} {...props} className={"rounded-full " + props.className}>
      <ChevronRight />
    </Button>
  );
}
