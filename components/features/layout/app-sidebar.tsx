import { Compass, Heart, House, LayoutDashboard } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useData } from "vike-react/useData";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { Data } from "@/pages/+data";
import { PlusButton } from "../../ui/custom-buttons";
import Link from "../../ui/link";
import Logo from "../../ui/logo";
import { Separator } from "../../ui/separator";
import NewPlaylistModal from "../playlist/new-playlist-modal";
import { SmallPlaylistWidget } from "../playlist/playlists-widgets";

export default function Sidebar() {
  const { session } = useSession();
  return (
    <div className="bg-card lg:w-70 md:w-60 fixed z-20 h-screen left-0 top-0 flex flex-col border-e-[1px]">
      <div className="w-full ">
        <div className="h-20 p-4 flex items-center">
          <Logo />
        </div>
        <div className="w-full p-4 pt-0">
          <NavBar />
        </div>

        <Separator />
      </div>
      {session && (
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
      )}
    </div>
  );
}
export function SidebarSection({ children }: { children: ReactNode }) {
  return <div className="w-full p-4">{children}</div>;
}

function NavBar() {
  const { instance } = useLanguage();
  const { session } = useSession();
  return (
    <nav className="flex flex-col w-full">
      <Link href="/" text={instance.getItem("homepage")} icon={<House />} />
      <Link href="/explorer" text={instance.getItem("explorePageTitle")} icon={<Compass />} />

      {session && (
        <>
          <Link href="/favorites" text={instance.getItem("favoritesPageTitle")} icon={<Heart />} />
          <Link
            href={`/dashboard`}
            text={instance.getItem("dashboard")}
            icon={<LayoutDashboard />}
          />
        </>
      )}
    </nav>
  );
}

function Playlists() {
  const { instance } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { userPlaylists } = useData<Data>();
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <h2 className="title-3">{instance.getItem("playlists")}</h2>
        <NewPlaylistModal isOpen={isOpen} setIsOpen={setIsOpen}>
          <PlusButton onClick={() => setIsOpen(true)} />
        </NewPlaylistModal>
      </div>
      <div className="flex flex-col w-full gap-2">
        {userPlaylists.success && userPlaylists.data.length > 0 ? (
          userPlaylists.data.map((playlist) => (
            <SmallPlaylistWidget key={playlist.id} playlist={playlist} />
          ))
        ) : (
          <p className="text-muted-foreground paragraph">No playlists yet</p>
        )}
      </div>
    </div>
  );
}

function Recents() {
  const { instance } = useLanguage();
  const { userPlaylists } = useData<Data>();
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between">
        <h2 className="title-3">{instance.getItem("recents")}</h2>
      </div>
      <div className="flex flex-col w-full gap-2">
        {userPlaylists.success && userPlaylists.data.length > 0 ? (
          userPlaylists.data.map((playlist) => (
            <SmallPlaylistWidget key={playlist.id} playlist={playlist} />
          ))
        ) : (
          <p className="text-muted-foreground paragraph">No playlists yet</p>
        )}
      </div>
    </div>
  );
}
