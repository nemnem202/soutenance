import { PlaylistItemsList } from "@/components/playlist-items";
import { getRandomPlaylist } from "@/lib/utils";

export default function Page() {
  const playlist = getRandomPlaylist();
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-end"></div>
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}
