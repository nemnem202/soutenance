import { useState } from "react";
import useSession from "./use-session";
import { onLogout } from "@/telefunc/connexion.telefunc";
import { errorToast, successToast } from "@/lib/toaster";
import { navigate } from "vike/client/router";

export default function useLogout() {
  const { setSession } = useSession();
  const [logoutLoading, setLoading] = useState(false);

  const triggerLogout = async () => {
    setLoading(true);
    const response = await onLogout();
    if (!response.success) {
      errorToast(response.title, response.description);
    } else {
      successToast("Logout successful");
    }
    setSession(null);
    setLoading(false);
  };

  return { triggerLogout, logoutLoading };
}
