import { Compass, Heart, House, LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";
import AccountPP from "../account-pp";
import useSession from "@/hooks/use-session";

export default function TabBar() {
  const { session, setSession } = useSession();
  return (
    <nav className="fixed bottom-0 h-20 w-full bg-card border-t flex justify-evenly items-center">
      <Link href="/" icon={<House className="w-full h-full" />} />
      <Link href="/explorer" icon={<Compass className="w-full h-full" />} />
      <Link href="/favorites" icon={<Heart className="w-full h-full" />} />
      <Link href="/dashboard" icon={<LayoutDashboard className="w-full h-full" />} />
      <Link href="/dashboard" icon={<AccountPP image={session?.profilePictureSource ?? undefined} />} />
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
