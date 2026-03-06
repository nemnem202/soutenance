import Headline from "@/components/headline";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";

export default function Page() {
  return (
    <>
      <Headline>Your projects</Headline>
      <MediumPlaylistWrapper allowToAddANewProject={true} />
    </>
  );
}
