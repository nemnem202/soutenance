import { Heart, Plus } from "lucide-react";
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
    <Button size={"icon"} variant={"ghost"} className="rounded-full">
      <Plus />
    </Button>
  );
}
