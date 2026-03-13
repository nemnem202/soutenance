import FavoritesSearchbarSpace from "@/components/favorites-searchbar-space";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <FavoritesSearchbarSpace label={instance.getItem("playlists")} />
      <MediumPlaylistWrapper />
    </>
  );
}
