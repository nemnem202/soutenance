import AccountPP from "@/components/ui/account-pp";
import Headline from "@/components/ui/headline";
import useSession from "@/hooks/use-session";

export default function MobileHeader({ title }: { title: string }) {
  const { session } = useSession();
  return (
    <div className="w-full flex gap-2 md:p-0 items-center mb-6">
      <a href={session ? "/settings" : "/login"}>
        <AccountPP image={session?.profilePicture ?? undefined} />
      </a>
      <Headline>{title}</Headline>
    </div>
  );
}
