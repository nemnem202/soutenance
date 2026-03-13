import Headline from "@/components/headline";
import MobileHeader from "@/components/mobile/header";
import { MediumPlaylistWrapper } from "@/components/playlists-widgets";
import SizeAdapter from "@/components/size-adapter";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline>{instance.getItem("your_playlists")}</Headline>
      <MediumPlaylistWrapper allowToAddANewPlaylist={true} />
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("dashboard")} />
      <MediumPlaylistWrapper allowToAddANewPlaylist={true} />
    </>
  );
}
