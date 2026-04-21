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
import { ChevronRight, ListPlus, Trash, UserIcon } from "lucide-react";
import { AddToPlaylistContent } from "./exercise-menu";
import { deletePlaylist } from "@/lib/utils";
import { useState } from "react";

export default function PlaylistMenu({ playlist }: { playlist: PlaylistDetailDto }) {
  const { instance } = useLanguage();
  const { session } = useSession();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <PlusButton />
      </DropdownMenuTrigger>
      <PlaylistMenuContent playlist={playlist} />
    </DropdownMenu>
  );
}

export function PlaylistMenuContent({ playlist }: { playlist: PlaylistDetailDto }) {
  const [currentContent, setCurrentContent] = useState<"main" | "addToPlaylist">("main");

  return (
    <DropdownMenuContent
      className="bg-background p-0 z-1 max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[var(--radix-dropdown-menu-content-available-width)] overflow-y-auto"
      side="right"
      align="start"
    >
      {currentContent === "main" && (
        <MainContent
          playlist={playlist}
          onAddToPlaylistClick={() => setCurrentContent("addToPlaylist")}
        />
      )}
      {currentContent === "addToPlaylist" && (
        <AddToPlaylistContent currentPlaylist={playlist} onBack={() => setCurrentContent("main")} />
      )}
    </DropdownMenuContent>
  );
}

function MainContent({
  playlist,
  onAddToPlaylistClick,
}: {
  playlist: PlaylistDetailDto;
  onAddToPlaylistClick: () => void;
}) {
  const { instance } = useLanguage();
  const { session } = useSession();

  return (
    <>
      <DropdownMenuGroup className="p-3">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onAddToPlaylistClick();
          }}
        >
          <ListPlus />
          {instance.getItem("add_to_playlist")}
          <ChevronRight className="ml-auto" />
        </DropdownMenuItem>
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
    </>
  );
}
