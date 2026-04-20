import { Brush, LanguagesIcon, LogOutIcon, Settings2, UserIcon } from "lucide-react";
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../organisms/dropdown-menu";
import AccountPP from "../../ui/account-pp";
import { Button } from "../../ui/button";

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
  const { session } = useSession();
  const { instance, setLanguage } = useLanguage();
  const { currentTheme, setDark, setLight } = useTheme();
  const { logoutLoading, triggerLogout } = useLogout();
  if (!session) return null;
  const handleLanguageChange = (lang: Language) => {
    localStorage.setItem("preferred-language", lang);
    setLanguage(lang);
  };
  return (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={() => navigate(`/account/${session.id}`)}>
        <UserIcon />
        {instance.getItem("profile")}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/settings")}>
        <Settings2 />
        {instance.getItem("settings")}
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-border" />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Brush />
          {instance.getItem("theme")}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
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
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <LanguagesIcon />
          {instance.getItem("language")}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="min-w-0">
            {availableLanguages.map((lang) => (
              <DropdownMenuCheckboxItem
                key={lang}
                checked={lang === instance.getCurrentLanguage()}
                onClick={() => handleLanguageChange(lang)}
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
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator className="bg-border" />
      <DropdownMenuItem variant="destructive" onClick={() => triggerLogout()}>
        {logoutLoading ? (
          <Spinner />
        ) : (
          <>
            <LogOutIcon />
            {instance.getItem("log_out")}
          </>
        )}
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
