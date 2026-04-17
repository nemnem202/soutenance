import { useState } from "react";
import { errorToast, successToast } from "@/lib/toaster";
import { onLogout } from "@/telefunc/connexion.telefunc";
import useSession from "./use-session";
import { reload } from "vike/client/router";

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
    reload();
    setSession(null);
    setLoading(false);
  };

  return { triggerLogout, logoutLoading };
}
