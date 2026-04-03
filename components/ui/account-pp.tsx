import type { Image } from "@/types/entities";
import { Avatar, AvatarImage } from "./avatar";

export default function AccountPP({
  image = {
    alt: "Placeholder image",
    src: "assets/images/account-default-pic.webp",
  },
}: {
  image?: Image;
}) {
  return (
    <Avatar>
      <AvatarImage {...image} />
    </Avatar>
  );
}
