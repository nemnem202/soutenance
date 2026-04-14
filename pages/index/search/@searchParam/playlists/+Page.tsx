import { useData } from "vike-react/useData";
import { Data } from "../+data";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";

export default function Page() {
  const { playlists } = useData<Data>();
  return playlists.success && <MediumPlaylistWrapper playlists={playlists.data} />;
}
