import { MediumAccountWrapper } from "@/components/features/auth/account-widgets";
import { useEffect } from "react";
import { useData } from "vike-react/useData";
import { navigate } from "vike/client/router";
import { Data } from "./+data";
import { usePageContext } from "vike-react/usePageContext";
import { UserSeeAllQUery } from "@/types/navigation";

export default function Page() {
  const { accounts } = useData<Data>();
  const pageContext = usePageContext();
  const searchParam = pageContext.urlParsed.search.search;

  useEffect(() => {
    if (!accounts.success) navigate("/404");
  }, [accounts]);

  if (!accounts.success) return null;

  return (
    <MediumAccountWrapper
      initialAccounts={accounts.data}
      searchParam={searchParam as UserSeeAllQUery}
    />
  );
}
