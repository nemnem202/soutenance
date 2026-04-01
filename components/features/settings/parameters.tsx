import { ArrowRightLeft, LogOut, X } from "lucide-react";
import { useId, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/organisms/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { availableLanguages } from "@/config/language-pack";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import flags from "@/i18n/flags";
import type { Language } from "@/types/i18n";
import { LoginModal } from "../auth/login-button";
import { SettingsParam } from "./settings-assets";
import useLogout from "@/hooks/use-logout";
import { Spinner } from "@/components/ui/spinner";
import { navigate } from "vike/client/router";
import useRemoveAccount from "@/hooks/use-remove-account";
import Modal from "@/components/organisms/modal";

export function ThemeParam() {
  const { instance } = useLanguage();
  const { currentTheme, setDark, setLight } = useTheme();
  const id = useId();

  return (
    <SettingsParam label={instance.getItem("theme")} id={id}>
      <Select
        value={currentTheme}
        onValueChange={(value) => {
          if (value === "dark") setDark();
          if (value === "light") setLight();
        }}
      >
        <SelectTrigger id={id}>{instance.getItem(currentTheme)}</SelectTrigger>
        <SelectContent>
          <SelectItem value="dark">{instance.getItem("dark")}</SelectItem>
          <SelectItem value="light">{instance.getItem("light")}</SelectItem>
        </SelectContent>
      </Select>
    </SettingsParam>
  );
}

export function LanguageParam() {
  const { instance, setLanguage } = useLanguage();
  const id = useId();
  const getLanguageItem = (lang: Language) => (
    <div className="flex gap-2">
      <img
        alt={`flag of ${lang}`}
        style={{ width: "20px" }}
        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${flags[lang]}.svg`}
      />
      {lang.charAt(0).toUpperCase() + lang.slice(1)}
    </div>
  );
  return (
    <SettingsParam label={instance.getItem("language")} id={id}>
      <Select
        value={instance.getCurrentLanguage()}
        onValueChange={(value) => setLanguage(value as Language)}
      >
        <SelectTrigger id={id}>
          {getLanguageItem(instance.getCurrentLanguage())}
        </SelectTrigger>
        <SelectContent>
          {availableLanguages.map((lang) => (
            <SelectItem value={lang} key={lang}>
              {getLanguageItem(lang)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingsParam>
  );
}

export function LogoutButton() {
  const { instance } = useLanguage();
  const { logoutLoading, triggerLogout } = useLogout();
  return (
    <Button
      variant={"destructive"}
      disabled={logoutLoading}
      onClick={async () => {
        await triggerLogout();
        navigate("/");
      }}
    >
      {logoutLoading ? (
        <Spinner />
      ) : (
        <>
          <LogOut /> {instance.getItem("log_out")}
        </>
      )}
    </Button>
  );
}

export function RemoveAccountButton() {
  const { instance } = useLanguage();
  const { removeAccountLoading, triggerRemoveAccount } = useRemoveAccount();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant={"destructive"}
        onClick={() => setIsOpen(true)}
        disabled={removeAccountLoading}
      >
        {removeAccountLoading ? (
          <Spinner />
        ) : (
          <>
            {" "}
            <X /> {instance.getItem("remove_account")}
          </>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full flex flex-col items-center gap-8">
          <div className="flex flex-col items-center w-full">
            <h2 className="title-1 text-primary">Are you shure ?</h2>
            <p className="paragraph-md">
              Your account and all the related data will be removed
            </p>
          </div>
          <Button
            variant={"destructive"}
            onClick={triggerRemoveAccount}
            disabled={removeAccountLoading}
          >
            {removeAccountLoading ? (
              <Spinner />
            ) : (
              <>
                <X /> {instance.getItem("remove_account")}
              </>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function ChangeAccountButton() {
  const { instance } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <ArrowRightLeft /> {instance.getItem("change_account")}
      </Button>
      <LoginModal initMode="login" isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export function UsernameParam() {
  const { instance } = useLanguage();
  const id = useId();
  const { session } = useSession();
  return (
    <SettingsParam
      label={instance.getItem("username")}
      id={id}
      orientation="vertical"
    >
      <Input
        className="!text-left p-2"
        id={id}
        defaultValue={session?.username}
      />
    </SettingsParam>
  );
}
