import { useLanguage } from "@/hooks/use-language";
import Searchbar from "./searchbar";

export default function FavoritesSearchbarSpace({ label }: { label: string }) {
  const { instance } = useLanguage();
  return (
    <div className="md:w-full w-[70vw] min-w-70 flex flex-col-reverse md:flex-row md:justify-between md:items-center md:my-9 mb-5 md:mb-0">
      <p className="title-3 hidden md:block">50 {label}</p>
      <div className="w-full max-w-116 ">
        <Searchbar placeholder={instance.getItem("search")} />
      </div>
    </div>
  );
}
