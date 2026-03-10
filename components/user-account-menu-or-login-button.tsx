import useSession from "@/hooks/use-session";
import LoginButton from "./login-button";
import AccountPP from "./account-pp";
import { faker } from "@faker-js/faker";
import getPlaceholders from "@/pages/+data";
import AccountMenu from "./account-menu";

export default function UserAccountORLogin() {
  const { session } = useSession();

  if (session) {
    return <AccountMenu />;
  } else return <LoginButton />;
}
