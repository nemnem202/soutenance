import { ReactNode } from "react";
import { Separator } from "./separator";
import { Compass, Heart, House, LayoutDashboard, Plus } from "lucide-react";
import { SmallPlaylistWidget } from "./playlists-widgets";
import { Button } from "./button";
import Logo from "./logo";
import Link from "./link";
import { navigate } from "vike/client/router";
import { PlusButton } from "./custom-buttons";

export default function Sidebar() {
  return (
    <div className="bg-card w-70 fixed z-2 h-screen left-0 top-0 flex flex-col border-e-[1px]">
      <div className="w-full ">
        <div className="h-20 p-4 flex items-center">
          <Logo />
        </div>
        <div className="w-full p-4 pt-0">
          <NavBar />
        </div>

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
export function SidebarSection({ children }: { children: ReactNode }) {
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

function Playlists() {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <h2 className="title-3">Playlists</h2>
        <PlusButton onClick={() => navigate("/new-playlist")} />
      </div>
      <div className="flex flex-col w-full gap-2">
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
        <h2 className="title-3">Recents</h2>
      </div>
      <div className="flex flex-col w-full gap-2">
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
