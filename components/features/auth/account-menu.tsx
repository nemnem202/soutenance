import {
  Brush,
  ChevronLeft,
  ChevronRight,
  LanguagesIcon,
  LogOutIcon,
  Settings2,
  UserIcon,
} from "lucide-react";
import { navigate } from "vike/client/router";
import { Spinner } from "@/components/ui/spinner";
import { availableLanguages } from "@/config/language-pack";
import { useLanguage } from "@/hooks/use-language";
import useLogout from "@/hooks/use-logout";
import useSession from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import flags from "@/i18n/flags";
import type { Language } from "@/types/i18n";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../organisms/dropdown-menu";
import AccountPP from "../../ui/account-pp";
import { Button } from "../../ui/button";
import { useState } from "react";

export default function AccountMenu() {
  const { session } = useSession();
  if (!session) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <AccountPP image={session.profilePicture} />
        </Button>
      </DropdownMenuTrigger>
      <AccountMenuContent />
    </DropdownMenu>
  );
}

export function AccountMenuContent() {
  const [currentContent, setCurrentContent] = useState<"main" | "theme" | "language">("main");

  return (
    <DropdownMenuContent className="bg-background p-0 z-10 max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[var(--radix-dropdown-menu-content-available-width)] overflow-y-auto">
      {currentContent === "main" && (
        <MainContent
          onThemeClick={() => setCurrentContent("theme")}
          onLanguageClick={() => setCurrentContent("language")}
        />
      )}
      {currentContent === "theme" && <ThemeContent onBack={() => setCurrentContent("main")} />}
      {currentContent === "language" && (
        <LanguageContent onBack={() => setCurrentContent("main")} />
      )}
    </DropdownMenuContent>
  );
}

function MainContent({
  onThemeClick,
  onLanguageClick,
}: {
  onThemeClick: () => void;
  onLanguageClick: () => void;
}) {
  const { instance } = useLanguage();
  const { session, setSession } = useSession();
  const { logoutLoading, triggerLogout } = useLogout();
  if (!session) return null;
  return (
    <>
      <DropdownMenuItem onClick={() => navigate(`/account/${session.id}`)}>
        <UserIcon />
        {instance.getItem("profile")}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/settings")}>
        <Settings2 />
        {instance.getItem("settings")}
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border" />
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onThemeClick();
        }}
      >
        <Brush />
        {instance.getItem("theme")}
        <ChevronRight className="ml-auto" />
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onLanguageClick();
        }}
      >
        <LanguagesIcon />
        {instance.getItem("language")}
        <ChevronRight className="ml-auto" />
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border" />
      <DropdownMenuItem variant="destructive" onClick={triggerLogout}>
        {logoutLoading ? (
          <Spinner />
        ) : (
          <>
            <LogOutIcon />
            {instance.getItem("log_out")}
          </>
        )}
      </DropdownMenuItem>
    </>
  );
}

function ThemeContent({ onBack }: { onBack: () => void }) {
  const { instance } = useLanguage();
  const { currentTheme, setDark, setLight } = useTheme();
  return (
    <>
      <SubContentHeader action={onBack} title={instance.getItem("theme")} />
      <DropdownMenuSeparator className="bg-border" />
      <DropdownMenuCheckboxItem
        checked={currentTheme === "dark"}
        onCheckedChange={(e) => {
          if (e) setDark();
        }}
      >
        {instance.getItem("dark")}
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={currentTheme === "light"}
        onCheckedChange={(e) => {
          if (e) setLight();
        }}
      >
        {instance.getItem("light")}
      </DropdownMenuCheckboxItem>
    </>
  );
}

function LanguageContent({ onBack }: { onBack: () => void }) {
  const { instance, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: Language) => {
    localStorage.setItem("preferred-language", lang);
    setLanguage(lang);
  };
  return (
    <>
      <SubContentHeader action={onBack} title={instance.getItem("language")} />
      <DropdownMenuSeparator className="bg-border" />
      {availableLanguages.map((lang) => (
        <DropdownMenuCheckboxItem
          key={lang}
          checked={lang === instance.getCurrentLanguage()}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleLanguageChange(lang);
          }}
          className="flex items-center justify-between gap-2"
        >
          {lang.charAt(0).toUpperCase() + lang.slice(1)}
          <img
            alt={`a flag of ${lang}`}
            style={{ width: "20px" }}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${flags[lang]}.svg`}
          />
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
}

export function SubContentHeader({ action, title }: { action: () => void; title: string }) {
  return (
    <DropdownMenuItem
      className="rounded-none"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        action();
      }}
    >
      <ChevronLeft />
      <p>{title}</p>
    </DropdownMenuItem>
  );
}
