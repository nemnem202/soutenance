import MobileHeader from "@/components/features/layout/mobile-header";
import NewPlaylistForm from "@/components/features/playlist/new-playlist-form";
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
      <Headline>{instance.getItem("new_playlist")}</Headline>
      <NewPlaylistForm />
    </>
  );
}

function Mobile() {
  const { instance } = useLanguage();
  return (
    <>
      <MobileHeader title={instance.getItem("new_playlist")} />
      <NewPlaylistForm />
    </>
  );
}
