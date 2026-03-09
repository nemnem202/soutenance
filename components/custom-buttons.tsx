import { Heart } from "lucide-react";
import { Button, ButtonProps } from "./button";

export function LikeButton({ ...props }: ButtonProps) {
  return (
    <Button variant={"ghost"} size={"icon"} {...props} className={"rounded-full " + props.className}>
      <Heart />
    </Button>
  );
}
