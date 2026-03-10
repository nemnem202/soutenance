import Headline from "@/components/headline";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";

export default function Page() {
  return (
    <>
      <Headline>Recently played</Headline>
      <MediumPlaylistWrapper />
    </>
  );
}
