import { LoginModalContent, RegisterModalContent } from "@/components/features/auth/login-button";
import { useState } from "react";
import { navigate } from "vike/client/router";

export default function Page() {
  const [mode, setMode] = useState<"login" | "register">("login");
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
