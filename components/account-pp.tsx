import { Account } from "@/types/account";

export default function AccountPP({ account }: { account: Account }) {
  return (
    <img
      className="rounded-full bg-primary aspect-square h-10 flex items-center justify-center"
      width={40}
      src={account.picture}
    />
  );
}
