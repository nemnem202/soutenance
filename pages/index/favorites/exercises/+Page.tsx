import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { PlaylistItemsList } from "@/components/features/playlist/playlist-items";
import { useLanguage } from "@/hooks/use-language";
import { getRandomPlaylist } from "@/lib/utils";

export default function Page() {
  const playlist = getRandomPlaylist();
  const { instance } = useLanguage();
  return (
    <div className="w-full flex flex-col">
      <FavoritesSearchbarSpace label={instance.getItem("exercises")} />
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}
