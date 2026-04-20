import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import { Data } from "./+data";
import { useData } from "vike-react/useData";
import { navigate } from "vike/client/router";
import { useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { PlaylistSeeAllQUery } from "@/types/navigation";

export default function Page() {
  const { playlists } = useData<Data>();
  const pageContext = usePageContext();
  const searchParam = pageContext.urlParsed.search.search;
  useEffect(() => {
    if (!playlists.success) navigate("/404");
  }, [playlists]);

  if (!playlists.success) return null;

  return (
    <MediumPlaylistWrapper
      initialPlaylists={playlists.data}
      searchParam={searchParam as PlaylistSeeAllQUery}
    />
  );
}
