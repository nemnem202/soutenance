import { MediumAccountWrapper } from "@/components/features/auth/account-widgets";
import { useData } from "vike-react/useData";
import { Data } from "../+data";

export default function Page() {
  const { users } = useData<Data>();
  return users.success && <MediumAccountWrapper accounts={users.data} />;
}
