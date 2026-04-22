import { LoginModalContent, RegisterModalContent } from "@/components/features/auth/login-button";
import useSession from "@/hooks/use-session";
import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";

export default function Page() {
  const { session } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    if (session) navigate("/");
  }, [session]);
  return (
    <div className="mb-10">
      {mode === "login" ? (
        <LoginModalContent setIsOpen={() => {}} setMode={setMode} onSuccess={() => navigate("/")} />
      ) : (
        <RegisterModalContent
          setIsOpen={() => {}}
          setMode={setMode}
          onSuccess={() => navigate("/")}
        />
      )}
    </div>
  );
}
