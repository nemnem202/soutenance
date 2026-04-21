import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";
import { useData } from "vike-react/useData";
import type { Data } from "../+data";
import { MediumAccountWrapper } from "@/components/features/auth/account-widgets";

export default function Page() {
  const { instance } = useLanguage();
  const { users } = useData<Data>();
  return users.success && users.data.length > 0 ? (
    <>
      <FavoritesSearchbarSpace
        label={instance.getItem("users")}
        numberOfItems={users.data.length}
      />
      <MediumAccountWrapper accounts={users.data} />
    </>
  ) : (
    <p className="paragraph-md text-muted-foreground">{instance.getItem("nothing_yet")}</p>
  );
}
