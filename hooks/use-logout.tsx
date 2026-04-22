import { useState } from "react";
import { errorToast, successToast } from "@/lib/toaster";
import { onLogout } from "@/telefunc/connexion.telefunc";
import useSession from "./use-session";

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
