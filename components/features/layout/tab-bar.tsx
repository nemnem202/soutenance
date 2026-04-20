import { Compass, Heart, House, Search, User } from "lucide-react";
import type { ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";
import useSession from "@/hooks/use-session";
import AccountPP from "@/components/ui/account-pp";

export default function TabBar() {
  const { session } = useSession();
  return (
    <nav className="h-20 bg-card border-t flex justify-evenly items-center">
      <Link href="/" icon={<House className="w-full h-full" />} />
      <Link href="/explorer" icon={<Compass className="w-full h-full" />} />
      <Link href="/favorites" icon={<Heart className="w-full h-full" />} />
      <Link href="/search" icon={<Search className="w-full h-full" />} />
      {session ? (
        <Link href={`/dashboard`} icon={<AccountPP image={session.profilePicture} />} />
      ) : (
        <Link href={`/login`} icon={<User className="w-full h-full" />} />
      )}
    </nav>
  );
}

function Link({ href, icon }: { href: string; icon?: ReactNode }) {
  const { urlPathname } = usePageContext();
  return (
    <a
      href={href}
      className={`title-3 h-12 flex items-center gap-2 hover:bg-popover p-2 rounded ${urlPathname === href && "text-primary fill-primary transition"}`}
    >
      {icon}
    </a>
  );
}
