import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <div className="w-full flex flex-col">
      <FavoritesSearchbarSpace label={instance.getItem("exercises")} />
      {/* <PlaylistItemsList playlist={playlist} /> */}
    </div>
  );
}
