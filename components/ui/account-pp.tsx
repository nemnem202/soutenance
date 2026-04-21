import type { Image } from "@/types/entities";
import { Avatar } from "./avatar";
import defaultUrl from "@/assets/images/account-default-pic.webp";

export default function AccountPP({
  image = {
    alt: "Placeholder image",
    url: defaultUrl,
  },
}: {
  image?: Image;
}) {
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
