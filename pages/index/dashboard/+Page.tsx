import Headline from "@/components/headline";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline>{instance.getItem("your_playlists")}</Headline>
      <MediumPlaylistWrapper allowToAddANewPlaylist={true} />
    </>
  );
}
