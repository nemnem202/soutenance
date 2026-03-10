import useSession from "@/hooks/use-session";
import AccountPP from "./account-pp";
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
} from "./dropdown-menu";

import { Button } from "./button";
import { Brush, LanguagesIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { navigate } from "vike/client/router";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/hooks/use-language";
import { availableLanguages } from "@/config/language-pack";
import flags from "@/i18n/flags";
import { Language } from "@/types/i18n";

export default function AccountMenu() {
  const { session, setSession } = useSession();
  const { currentTheme, setDark, setLight } = useTheme();
  const { instance, setLanguage } = useLanguage();
  if (!session) return null;

  const handleLanguageChange = (lang: Language) => {
    localStorage.setItem("preferred-language", lang);
    setLanguage(lang);
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <AccountPP image={session.profilePictureSource} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate("/account/" + session.userId)}>
          <UserIcon />
          {instance.getItem("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <SettingsIcon />
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
                  checked={lang === instance.getCurrentLanguage()}
                  onClick={() => handleLanguageChange(lang)}
                  className="flex items-center justify-between gap-2"
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  <img
                    style={{ width: "20px" }}
                    src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${flags[lang]}.svg`}
                  />
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            setSession(null);
            navigate("/");
          }}
        >
          <LogOutIcon />
          {instance.getItem("log_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
