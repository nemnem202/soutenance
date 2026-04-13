import type { Image } from "@/types/entities";
import { Avatar, AvatarImage } from "./avatar";

export default function AccountPP({
  image = {
    alt: "Placeholder image",
    url: "assets/images/account-default-pic.webp",
  },
}: {
  image?: Image;
}) {
  return (
    <Avatar>
      <AvatarImage alt={image.alt} src={image.url} />
    </Avatar>
  );
}
