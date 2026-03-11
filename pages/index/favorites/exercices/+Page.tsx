import { PlaylistItemsList } from "@/components/playlist-items";
import Searchbar from "@/components/searchbar";
import { useLanguage } from "@/hooks/use-language";
import { getRandomPlaylist } from "@/lib/utils";

export default function Page() {
  const playlist = getRandomPlaylist();
  const { instance } = useLanguage();
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between items-center my-9">
        <p className="title-2">
          {playlist.exercicesIds.length} {instance.getItem("exercices")}
        </p>
        <div className="w-full max-w-116 ">
          <Searchbar placeholder={instance.getItem("search_in_playlist")} />
        </div>
      </div>
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}
