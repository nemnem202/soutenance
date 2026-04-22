import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";
import type { Data } from "../+data";
import { useData } from "vike-react/useData";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import { useState } from "react";

export default function Page() {
  const { instance } = useLanguage();
  const { playlists } = useData<Data>();
  return playlists.success && playlists.data.length > 0 ? (
    <Content playlists={playlists.data} />
  ) : (
    <p className="paragraph-md text-muted-foreground">{instance.getItem("nothing_yet")}</p>
  );
}

function Content({ playlists }: { playlists: PlaylistCardDto[] }) {
  const { instance } = useLanguage();
  const [displayedPlaylists, setDisplayedPlaylists] = useState(playlists);
  return (
    <>
      <FavoritesSearchbarSpace
        label={instance.getItem("playlists")}
        numberOfItems={playlists.length}
        placeholder={instance.getItem("search")}
        items={playlists}
        onUpdate={setDisplayedPlaylists}
        type="playlists"
      />
      <MediumPlaylistWrapper playlists={displayedPlaylists} />
    </>
  );
}
