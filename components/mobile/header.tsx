import useSession from "@/hooks/use-session";
import AccountPP from "../account-pp";
import Headline from "../headline";

export default function MobileHeader({ title }: { title: string }) {
  const { session, setSession } = useSession();
  return (
    <div className="w-full flex gap-2 p-4 md:p-0 items-center">
      <AccountPP image={session?.profilePictureSource ?? undefined} />
      <Headline>{title}</Headline>
    </div>
  );
}
