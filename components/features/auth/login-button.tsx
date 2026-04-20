import { type Dispatch, type SetStateAction, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import GoogleLoginButton from "../../organisms/google-login-button";
import Modal from "../../organisms/modal";
import { Button } from "../../ui/button";
import Logo from "../../ui/logo";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { instance } = useLanguage();
  return (
    <>
      <Button variant={"link"} className="title-3 text-primary" onClick={() => setIsOpen(true)}>
        {instance.getItem("login")}
      </Button>
      <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} initMode="login" />
    </>
  );
}

export function LoginModal({
  isOpen,
  setIsOpen,
  onSuccess = () => {},
  initMode,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
  initMode: "login" | "register";
}) {
  const [mode, setMode] = useState<"login" | "register">(initMode);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      size="md"
      title="Login Modal"
    >
      {mode === "login" ? (
        <LoginModalContent setMode={setMode} setIsOpen={setIsOpen} onSuccess={onSuccess} />
      ) : (
        <RegisterModalContent setMode={setMode} setIsOpen={setIsOpen} onSuccess={onSuccess} />
      )}
    </Modal>
  );
}

export function LoginModalContent({
  setMode,
  setIsOpen,
  onSuccess = () => {},
}: {
  setMode: Dispatch<SetStateAction<"login" | "register">>;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
}) {
  const { instance } = useLanguage();
  return (
    <div className="flex flex-col items-center min-w-0 min-h-0 gap-4">
      <Logo />
      <LoginForm
        onSuccess={() => {
          setIsOpen(false);
          onSuccess();
        }}
      />
      <div className="flex flex-col items-center w-full gap-3">
        <p className="paragraph-sm text-muted-foreground">{instance.getItem("or_login_with")}</p>
        <GoogleLoginButton />
      </div>
      <p className="paragraph-md flex gap-2">
        {instance.getItem("dont_have_an_account")}
        <Button
          variant={"link"}
          className="text-primary p-0 h-min paragraph-md "
          onClick={(e) => {
            e.preventDefault();
            setMode("register");
          }}
        >
          {instance.getItem("register_here")}
        </Button>
      </p>
    </div>
  );
}

export function RegisterModalContent({
  setMode,
  setIsOpen,
  onSuccess = () => {},
}: {
  setMode: Dispatch<SetStateAction<"login" | "register">>;
  setIsOpen: (value: boolean) => void;
  onSuccess?: () => void;
}) {
  const { instance } = useLanguage();
  return (
    <div className="flex flex-col items-center min-w-0 min-h-0 gap-4">
      <Logo />
      <RegisterForm
        onSuccess={() => {
          setIsOpen(false);
          onSuccess();
        }}
      />
      <div className="flex flex-col items-center w-full gap-3">
        <p className="paragraph-sm text-muted-foreground">{instance.getItem("or_login_with")}</p>
        <GoogleLoginButton />
      </div>
      <p className="paragraph-md flex gap-2">
        {instance.getItem("already_have_an_account")}
        <Button
          variant={"link"}
          className="text-primary p-0 h-min paragraph-md "
          onClick={(e) => {
            e.preventDefault();
            setMode("login");
          }}
        >
          {instance.getItem("login_here")}
        </Button>
      </p>
    </div>
  );
}
