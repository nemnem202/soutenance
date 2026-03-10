import { SearchPlaylistItemsList } from "@/components/playlist-items";
import { getRandomPlaylist } from "@/pages/+data";

export default function Page() {
  const playlist = getRandomPlaylist();
  return (
    <>
      <SearchPlaylistItemsList playlist={playlist} />
    </>
  );
}
