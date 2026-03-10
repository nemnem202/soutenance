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

export default function AccountMenu() {
  const { session, setSession } = useSession();
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
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <SettingsIcon />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Brush />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem checked>Dark</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Light</DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LanguagesIcon />
            Language
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
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
