import { MediumAccountWrapper } from "@/components/account-widgets";
import FavoritesSearchbarSpace from "@/components/favorites-searchbar-space";
import Searchbar from "@/components/searchbar";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <FavoritesSearchbarSpace label={instance.getItem("users")} />
      <MediumAccountWrapper />
    </>
  );
}
