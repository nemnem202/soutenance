import { ArrowRightLeft, LogOut, RefreshCcw, X } from "lucide-react";
import { type ChangeEvent, useId, useRef, useState } from "react";
import { navigate } from "vike/client/router";
import Modal from "@/components/organisms/modal";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/organisms/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { availableLanguages } from "@/config/language-pack";
import { useLanguage } from "@/hooks/use-language";
import useLogout from "@/hooks/use-logout";
import useRemoveAccount from "@/hooks/use-remove-account";
import useSession from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import flags from "@/i18n/flags";
import { errorToast, successToast } from "@/lib/toaster";
import { onUsernameChange } from "@/telefunc/username-change.telefunc";
import type { Language } from "@/types/i18n";
import { LoginModal } from "../auth/login-button";
import { SettingsParam, SettingsRow } from "./settings-assets";
import { Input } from "@/components/ui/input";

export function ThemePicker() {
  const { currentTheme, setDark, setLight } = useTheme();
  const { instance } = useLanguage();

  return (
    <div className="flex gap-3 flex-wrap">
      <ThemeCard
        themeKey="light"
        label={instance.getItem("light")}
        isActive={currentTheme === "light"}
        onClick={setLight}
      />
      <ThemeCard
        themeKey="dark"
        label={instance.getItem("dark")}
        isActive={currentTheme === "dark"}
        onClick={setDark}
      />
    </div>
  );
}

function ThemeCard({
  themeKey,
  label,
  isActive,
  onClick,
}: {
  themeKey: "light" | "dark";
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const isDark = themeKey === "dark";

  const bg = isDark ? "#1a1a1a" : "#ffffff";
  const surface = isDark ? "#2a2a2a" : "#f4f4f4";
  const border = isDark ? "#3a3a3a" : "#e2e2e2";
  const text = isDark ? "#f0f0f0" : "#111111";
  const textMuted = isDark ? "#888888" : "#999999";
  const primary = "#bb73ff";
  const primaryMuted = isDark ? "#7e4eab" : "#d4a8ff";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col gap-2 p-1 rounded-xl border-2 transition cursor-pointer ${
        isActive ? "border-primary" : "border-border hover:border-muted-foreground/40"
      }`}
      style={{ background: "transparent" }}
    >
      {/* Skeleton preview */}
      <div
        className="rounded-lg overflow-hidden w-40"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        {/* Faux topbar */}
        <div
          className="flex items-center gap-1.5 px-3 py-2"
          style={{ background: surface, borderBottom: `1px solid ${border}` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: primaryMuted }} />
          <div className="h-1.5 rounded-full flex-1" style={{ background: border }} />
          <div className="w-5 h-1.5 rounded-full" style={{ background: border }} />
        </div>

        {/* Faux sidebar + content */}
        <div className="flex" style={{ minHeight: "88px" }}>
          {/* Sidebar */}
          <div
            className="flex flex-col gap-1.5 p-2"
            style={{ background: surface, borderRight: `1px solid ${border}`, width: "48px" }}
          >
            <div
              className="w-full h-1.5 rounded-full"
              style={{ background: primary, opacity: 0.8 }}
            />
            <div className="w-full h-1.5 rounded-full" style={{ background: border }} />
            <div className="w-full h-1.5 rounded-full" style={{ background: border }} />
            <div className="w-3/4 h-1.5 rounded-full" style={{ background: border }} />
          </div>

          {/* Content */}
          <div className="flex-1 p-2 flex flex-col gap-2">
            {/* Card 1 */}
            <div
              className="rounded-md p-1.5 flex flex-col gap-1"
              style={{ background: surface, border: `1px solid ${border}` }}
            >
              <div
                className="h-1.5 rounded-full w-3/4"
                style={{ background: text, opacity: 0.5 }}
              />
              <div
                className="h-1 rounded-full w-full"
                style={{ background: textMuted, opacity: 0.4 }}
              />
              <div
                className="h-1 rounded-full w-2/3"
                style={{ background: textMuted, opacity: 0.4 }}
              />
            </div>
            {/* Accent button */}
            <div className="h-3 rounded-md w-2/3" style={{ background: primary, opacity: 0.85 }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 pb-0.5">
        <span className="paragraph-sm font-medium text-foreground">{label}</span>
        {isActive && (
          <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
              <title>Label</title>
              <path
                d="M1 3.5L3.5 6L8 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </button>
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
        <SelectTrigger id={id}>{getLanguageItem(instance.getCurrentLanguage())}</SelectTrigger>
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
        triggerLogout();
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
            <p className="paragraph-md">Your account and all the related data will be removed</p>
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
      <LoginModal
        initMode="login"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSuccess={() => navigate("/")}
      />
    </>
  );
}

export function UsernameParam() {
  const { instance } = useLanguage();
  const id = useId();
  const { session, setSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [inputMatch, setInputMatch] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleValueChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value !== session?.username) {
      setInputMatch(false);
    } else {
      setInputMatch(true);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!inputRef.current) return setLoading(false);
    const response = await onUsernameChange(inputRef.current.value);

    if (response.success) {
      successToast(`Success !`);
      setSession(response.data);
    } else {
      errorToast(response.title, response.description);
    }

    setLoading(false);
  };
  return (
    <SettingsRow label={instance.getItem("username")}>
      <div className="flex gap-3 w-full">
        <Input
          ref={inputRef}
          id={id}
          defaultValue={session?.username}
          onChange={handleValueChange}
          className={"flex-1"}
        />
        <Button variant={"secondary"} disabled={loading} onClick={handleSubmit}>
          {loading ? <Spinner /> : <RefreshCcw />}
        </Button>
      </div>
    </SettingsRow>
  );
}
