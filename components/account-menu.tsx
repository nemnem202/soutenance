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

export default function AccountMenu() {
  const { session, setSession } = useSession();
  const { currentTheme, setDark, setLight } = useTheme();
  const { instance } = useLanguage();
  if (!session) return null;

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
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem checked>English</DropdownMenuCheckboxItem>
              {["French", "Chinese", "Deutch", "Italian"].map((lang) => (
                <DropdownMenuCheckboxItem>{lang}</DropdownMenuCheckboxItem>
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
