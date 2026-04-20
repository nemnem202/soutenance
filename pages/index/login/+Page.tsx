import { LoginModalContent, RegisterModalContent } from "@/components/features/auth/login-button";
import { useState } from "react";

export default function Page() {
  const [mode, setMode] = useState<"login" | "register">("login");
  return (
    <div className="mb-10">
      {mode === "login" ? (
        <LoginModalContent setIsOpen={() => {}} setMode={setMode} />
      ) : (
        <RegisterModalContent setIsOpen={() => {}} setMode={setMode} />
      )}
    </div>
  );
}
