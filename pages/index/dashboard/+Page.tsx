import Headline from "@/components/headline";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";

export default function Page() {
  return (
    <>
      <Headline>Your playlists</Headline>
      <MediumPlaylistWrapper allowToAddANewPlaylist={true} />
    </>
  );
}
