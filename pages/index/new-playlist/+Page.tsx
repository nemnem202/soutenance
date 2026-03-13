import Headline from "@/components/headline";
import MobileHeader from "@/components/mobile/header";
import NewPlaylistForm from "@/components/new-playlist-form";
import SizeAdapter from "@/components/size-adapter";
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
    </>
  );
}
