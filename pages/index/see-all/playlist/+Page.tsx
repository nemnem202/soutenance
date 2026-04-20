import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import { Data } from "./+data";
import { useData } from "vike-react/useData";
import { navigate } from "vike/client/router";
import { useEffect } from "react";

export default function Page() {
  const { playlists } = useData<Data>();

  useEffect(() => {
    if (!playlists.success) navigate("/404");
  }, [playlists]);

  if (!playlists.success) return null;

  return <MediumPlaylistWrapper playlists={playlists.data} />;
}
