import Headline from "@/components/headline";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";

export default function Page() {
  return (
    <div className="flex flex-col">
      <Headline>Recently played</Headline>
      <MediumPlaylistWrapper />
    </div>
  );
}
