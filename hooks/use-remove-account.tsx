import { useState } from "react";
import useSession from "./use-session";
import { onRemoveAccount } from "@/telefunc/connexion.telefunc";
import { errorToast, successToast } from "@/lib/toaster";
import { navigate } from "vike/client/router";

export default function useRemoveAccount() {
  const { setSession } = useSession();
  const [removeAccountLoading, setLoading] = useState(false);

  const triggerRemoveAccount = async () => {
    setLoading(true);
    const response = await onRemoveAccount();
    if (!response.success) {
      errorToast(response.title, response.description);
    } else {
      successToast("Your account has been removed");
    }
    setSession(null);
    setLoading(false);
    navigate("/");
  };

  return { triggerRemoveAccount, removeAccountLoading };
}
