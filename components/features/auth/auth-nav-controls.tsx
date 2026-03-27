import useSession from "@/hooks/use-session";
import LoginButton from "./login-button";
import AccountMenu from "./account-menu";

export default function AuthNavControls() {
  const { session } = useSession();

  if (session) {
    return <AccountMenu />;
  } else return <LoginButton />;
}
