import { useData } from "vike-react/useData";
import { SearchPlaylistItemsList } from "@/components/features/playlist/playlist-items";
import type { Data } from "../+data";

export default function Page() {
  const { exercises } = useData<Data>();
  return exercises.success && <SearchPlaylistItemsList exercises={exercises.data} />;
}
