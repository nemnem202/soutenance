import { MediumPlaylistWrapper } from "@/components/playlists-widgets";
import Searchbar from "@/components/searchbar";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <div className="w-full flex justify-between items-center my-9">
        <p className="title-2">50 {instance.getItem("playlists")}</p>
        <div className="w-full max-w-116 ">
          <Searchbar placeholder={instance.getItem("search")} />
        </div>
      </div>
      <MediumPlaylistWrapper />
    </>
  );
}
