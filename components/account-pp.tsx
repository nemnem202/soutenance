import { Account } from "@/types/account";
import { Avatar, AvatarImage } from "./avatar";

export default function AccountPP({ image = "assets/images/account-default-pic.webp" }: { image?: string }) {
  return (
    <Avatar>
      <AvatarImage src={image} alt={"user-avatar"} />
    </Avatar>
    // <img
    //   className="rounded-full bg-primary aspect-square h-10 flex items-center justify-center"
    //   loading="lazy"
    //   width={40}
    //   src={image}
    // />
  );
}
