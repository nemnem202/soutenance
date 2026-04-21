import { Avatar } from "./avatar";
import defaultUrl from "@/assets/images/account-default-pic.webp";
import Image from "./image";
import type { Image as ImageType } from "@/types/entities";

export default function AccountPP({
  image = {
    alt: "Placeholder image",
    url: defaultUrl,
  },
}: {
  image?: ImageType;
}) {
  return (
    <Avatar>
      <Image
        width={40}
        alt={image.alt}
        src={image.url}
        referrerPolicy="no-referrer"
        className="object-cover w-full h-full"
      />
    </Avatar>
  );
}
