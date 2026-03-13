import FavoritesSearchbarSpace from "@/components/favorites-searchbar-space";
import { PlaylistItemsList } from "@/components/playlist-items";
import Searchbar from "@/components/searchbar";
import { useLanguage } from "@/hooks/use-language";
import { getRandomPlaylist } from "@/lib/utils";

export default function Page() {
  const playlist = getRandomPlaylist();
  const { instance } = useLanguage();
  return (
    <div className="w-full flex flex-col">
      <FavoritesSearchbarSpace label={instance.getItem("exercices")} />
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}
