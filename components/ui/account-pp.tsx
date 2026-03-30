import { Avatar, AvatarImage } from "./avatar";

export default function AccountPP({ image = "assets/images/account-default-pic.webp" }: { image?: string }) {
  return (
    <Avatar>
      <AvatarImage src={image} alt={"user-avatar"} />
    </Avatar>
  );
}
