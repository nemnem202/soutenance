import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";
import { Data } from "../+data";
import { useData } from "vike-react/useData";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";

export default function Page() {
  const { instance } = useLanguage();
  const { playlists } = useData<Data>();
  return (
    playlists.success &&
    playlists.data.length > 0 && (
      <>
        <FavoritesSearchbarSpace
          label={instance.getItem("playlists")}
          numberOfItems={playlists.data.length}
        />
        <MediumPlaylistWrapper playlists={playlists.data} />
      </>
    )
  );
}
