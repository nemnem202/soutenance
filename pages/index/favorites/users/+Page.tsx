import { MediumAccountWrapper } from "@/components/features/auth/account-widgets";
import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import Searchbar from "@/components/organisms/searchbar";
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
