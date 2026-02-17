import { ReactNode } from "react";
import { Separator } from "./separator";
import { Compass, Heart, House, LayoutDashboard, Plus } from "lucide-react";
import { usePageContext } from "vike-react/usePageContext";
import { SmallPlaylistWidget } from "./playlists-widgets";
import { Button } from "./button";

export default function Sidebar() {
  return (
    <div className="bg-card w-70 fixed z-2 h-screen left-0 top-0 flex flex-col border-e-[1px]">
      <div className="w-full ">
        <div className="h-20 p-4 flex items-center">
          <img src={"assets/logo.svg"} alt="Logo" className="h-8" />
        </div>
        <SidebarSection>
          <NavBar />
        </SidebarSection>
        <Separator />
      </div>
      <div className="flex-1 overflow-y-auto ">
        <SidebarSection>
          <Playlists />
        </SidebarSection>
        <Separator />
        <SidebarSection>
          <Recents />
        </SidebarSection>
        <Separator />
      </div>
    </div>
  );
}
function SidebarSection({ children }: { children: ReactNode }) {
  return <div className="w-full p-4">{children}</div>;
}

function NavBar() {
  return (
    <nav className="flex flex-col w-full">
      <Link href="/" text="Homepage" icon={<House />} />
      <Link href="/explorer" text="Explore" icon={<Compass />} />
      <Link href="/favorites" text="Favorites" icon={<Heart />} />
      <Link href="/dashboard" text="Dashboard" icon={<LayoutDashboard />} />
    </nav>
  );
}

function Link({ href, text, icon }: { href: string; text: string; icon: ReactNode }) {
  const { urlPathname } = usePageContext();
  return (
    <a
      href={href}
      className={`h-12 flex items-center gap-2 hover:bg-popover p-2 rounded ${urlPathname === href && "text-primary fill-primary"}`}
    >
      {icon}
      <span>{text}</span>
    </a>
  );
}

function Playlists() {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <h2>Playlists</h2>
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <Plus />
        </Button>
      </div>
      <div className="flex flex-col w-full">
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
      </div>
    </div>
  );
}

function Recents() {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between">
        <h2>Recents</h2>
      </div>
      <div className="flex flex-col w-full">
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget /> <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
        <SmallPlaylistWidget />
      </div>
    </div>
  );
}
