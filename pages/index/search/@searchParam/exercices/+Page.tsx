import { SearchPlaylistItemsList } from "@/components/features/playlist/playlist-items";
import { getRandomPlaylist } from "@/lib/utils";

export default function Page() {
  const playlist = getRandomPlaylist();
  return (
    <>
      <SearchPlaylistItemsList playlist={playlist} />
    </>
  );
}
