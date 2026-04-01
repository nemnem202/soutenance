import useSession from "@/hooks/use-session";
import AccountMenu from "./account-menu";
import LoginButton from "./login-button";

export default function AuthNavControls() {
  const { session } = useSession();

  if (session) {
    return <AccountMenu />;
  } else return <LoginButton />;
}
