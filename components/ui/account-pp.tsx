import { logger } from "@/lib/logger";
import type { Image } from "@/types/entities";
import { Avatar } from "./avatar";

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
      <img
        alt={image.alt}
        src={image.url}
        referrerPolicy="no-referrer"
        className="object-cover w-full h-full"
      />
    </Avatar>
  );
}
