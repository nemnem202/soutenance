import MobileHeader from "@/components/features/layout/mobile-header";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import Headline from "@/components/ui/headline";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline>{instance.getItem("recentlyPlayed")}</Headline>
      <MediumPlaylistWrapper />
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("seeAll")} />
      <MediumPlaylistWrapper />
    </>
  );
}
