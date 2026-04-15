import { useData } from "vike-react/useData";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import type { Data } from "../+data";

export default function Page() {
  const { playlists } = useData<Data>();
  return playlists.success && <MediumPlaylistWrapper playlists={playlists.data} />;
}
