import useSession from "@/hooks/use-session";
import LoginButton from "./login-button";
import AccountPP from "./account-pp";
import { faker } from "@faker-js/faker";
import getPlaceholders from "@/pages/+data";

export default function UserAccountORLogin() {
  const { session } = useSession();

  if (session) {
    return <AccountPP account={faker.helpers.arrayElement(getPlaceholders().ACCOUNTS_PLACEHOLDER)} />;
  } else return <LoginButton />;
}
