import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";

export default function Page() {
  const { instance } = useLanguage();
  return (
    <>
      <FavoritesSearchbarSpace label={instance.getItem("users")} />
      {/* <MediumAccountWrapper /> */}
    </>
  );
}
