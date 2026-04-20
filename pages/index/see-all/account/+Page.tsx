import { MediumAccountWrapper } from "@/components/features/auth/account-widgets";
import { useEffect } from "react";
import { useData } from "vike-react/useData";
import { navigate } from "vike/client/router";
import { Data } from "./+data";

export default function Page() {
  const { accounts } = useData<Data>();

  useEffect(() => {
    if (!accounts.success) navigate("/404");
  }, [accounts]);

  if (!accounts.success) return null;

  return <MediumAccountWrapper accounts={accounts.data} />;
}
