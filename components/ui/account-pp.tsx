import type { Image } from "@/types/entities";
import { Avatar, AvatarImage } from "./avatar";
import { logger } from "@/lib/logger";

export default function AccountPP({
  image = {
    alt: "Placeholder image",
    url: "assets/images/account-default-pic.webp",
  },
}: {
  image?: Image;
}) {
  logger.info("Profile picture: ", image);
  return (
    <Avatar>
      <img alt={image.alt} src={image.url} referrerPolicy="no-referrer" />
    </Avatar>
  );
}
