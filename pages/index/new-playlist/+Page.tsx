import Headline from "@/components/headline";
import NewPlaylistForm from "@/components/new-playlist-form";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <Headline>{instance.getItem("new_playlist")}</Headline>
      <NewPlaylistForm />
    </>
  );
}
