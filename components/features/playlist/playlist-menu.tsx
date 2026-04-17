import type { PlaylistDetailDto } from "@/types/dtos/playlist";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../organisms/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { PlusButton } from "@/components/ui/custom-buttons";
import { Separator } from "@/components/ui/separator";
import useSession from "@/hooks/use-session";
import { Trash, UserIcon } from "lucide-react";
import { DropdownSubMenuAddToPlaylist } from "./exercise-menu";
import { deletePlaylist } from "@/lib/utils";

export default function PlaylistMenu({ playlist }: { playlist: PlaylistDetailDto }) {
  const { instance } = useLanguage();
  const { session } = useSession();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <PlusButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background p-0 z-1" side="right" align="start">
        <DropdownMenuGroup className="p-3">
          <DropdownSubMenuAddToPlaylist currentPlaylist={playlist} />
          <button type="button" className="all-unset" onClick={() => deletePlaylist(playlist.id)}>
            <DropdownMenuItem variant="destructive" disabled={playlist.author.id !== session?.id}>
              <Trash />
              {instance.getItem("delete_playlist")}
            </DropdownMenuItem>
          </button>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuGroup className="p-3">
          <a href={`/account/${playlist.author.id}`} className="all-unset">
            <DropdownMenuItem>
              <UserIcon />
              {instance.getItem("author")}
            </DropdownMenuItem>
          </a>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
