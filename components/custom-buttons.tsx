import { Heart } from "lucide-react";
import { Button } from "./button";

export function LikeButton() {
  return (
    <Button variant={"ghost"} className="rounded-full" size={"icon"}>
      <Heart />
    </Button>
  );
}
