import useSession from "@/hooks/use-session";
import LoginButton from "./login-button";
import AccountPPMenu from "./account-pp";

export default function UserAccountORLogin() {
  const { session } = useSession();

  if (session) {
    return <AccountPPMenu />;
  } else return <LoginButton />;
}
