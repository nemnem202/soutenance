import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";
import { useData } from "vike-react/useData";
import type { Data } from "../+data";
import { MediumAccountWrapper } from "@/components/features/auth/account-widgets";
import { useState } from "react";
import type { UserCardDto } from "@/types/dtos/user";

export default function Page() {
  const { instance } = useLanguage();
  const { users } = useData<Data>();
  return users.success && users.data.length > 0 ? (
    <Content users={users.data} />
  ) : (
    <p className="paragraph-md text-muted-foreground">{instance.getItem("nothing_yet")}</p>
  );
}

function Content({ users }: { users: UserCardDto[] }) {
  const { instance } = useLanguage();
  const [displayedUsers, setDisplayedUsers] = useState(users);
  return (
    <>
      <FavoritesSearchbarSpace
        label={instance.getItem("users")}
        numberOfItems={users.length}
        placeholder={instance.getItem("search")}
        items={users}
        onUpdate={setDisplayedUsers}
        type="users"
      />
      <MediumAccountWrapper accounts={displayedUsers} />
    </>
  );
}
