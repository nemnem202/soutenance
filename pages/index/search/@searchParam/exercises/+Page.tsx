import { useData } from "vike-react/useData";
import { Data } from "../+data";
import { SearchPlaylistItemsList } from "@/components/features/playlist/playlist-items";

export default function Page() {
  const { exercises } = useData<Data>();
  return exercises.success && <SearchPlaylistItemsList exercises={exercises.data} />;
}
