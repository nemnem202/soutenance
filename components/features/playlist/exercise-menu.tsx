import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import Searchbar from "@/components/organisms/searchbar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import { Album, Trash, UserIcon } from "lucide-react";
import { useState } from "react";
import { SmallAddNewPlaylistWidget, SmallAddToPlaylistWidget } from "./playlists-widgets";
import { useData } from "vike-react/useData";
import type { Data } from "@/pages/+data";
import { loadingToast } from "@/lib/toaster";
import { reload } from "vike/client/router";
import useSession from "@/hooks/use-session";
import type { PlaylistCardDto, PlaylistDetailDto } from "@/types/dtos/playlist";
import { onRemoveExerciseFromPlaylist } from "@/telefunc/remove-from-playlist.telefunc";
import { MenuButton } from "@/components/ui/custom-buttons";
import { addExerciseToPlaylist, addPlaylistToPlaylist } from "@/lib/utils";

export default function ExerciseContextMenuButton({
  exercise,
  playlistContext,
}: {
  exercise: ExerciseCardDto;
  playlistContext: PlaylistDetailDto;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { instance } = useLanguage();
  const { session } = useSession();

  const removeExerciseFromPlaylist = async () => {
    if (playlistContext.author.id !== session?.id) return;
    const responsePromise = onRemoveExerciseFromPlaylist(playlistContext.id, exercise.id);
    loadingToast(responsePromise);
    await responsePromise;
    reload();
  };
  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <MenuButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(true);
          }}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background p-0 z-1" side="right" align="start">
        <DropdownMenuGroup className="p-3">
          <DropdownSubMenuAddToPlaylist currentExercise={exercise} />
          <button type="button" className="all-unset" onClick={removeExerciseFromPlaylist}>
            <DropdownMenuItem
              variant="destructive"
              disabled={playlistContext.author.id !== session?.id}
            >
              <Trash />
              {instance.getItem("remove_from_playlist")}
            </DropdownMenuItem>
          </button>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuGroup className="p-3">
          <a href={`/account/${exercise.author.id}`} className="all-unset">
            <DropdownMenuItem>
              <UserIcon />
              {instance.getItem("author")}
            </DropdownMenuItem>
          </a>
          <a href={`/playlist/${exercise.originPlaylist.id}`} className="all-unset">
            <DropdownMenuItem>
              <Album />
              {instance.getItem("original_playlist")}
            </DropdownMenuItem>
          </a>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DropdownSubMenuAddToPlaylist({
  currentExercise,
  currentPlaylist,
}: {
  currentExercise?: ExerciseCardDto;
  currentPlaylist?: PlaylistCardDto;
}) {
  const { instance } = useLanguage();
  const { userPlaylists } = useData<Data>();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{instance.getItem("add_to_playlist")}</DropdownMenuSubTrigger>
      <DropdownMenuContent className="bg-background p-0 z-1" side="right" align="start">
        <DropdownMenuGroup className="p-3">
          <DropdownMenuLabel className="title-3">
            {instance.getItem("add_to_playlist")}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuGroup className="p-3">
          <Searchbar placeholder={instance.getItem("search")} />
        </DropdownMenuGroup>
        <DropdownMenuGroup className="p-3 pt-0 overflow-y-auto  max-h-80 flex flex-col">
          <SmallAddNewPlaylistWidget />
          {userPlaylists.success &&
            userPlaylists.data.map((playlist) => (
              <DropdownMenuItem className="p-0" key={playlist.id}>
                <SmallAddToPlaylistWidget
                  playlist={playlist}
                  callBack={async () => {
                    currentExercise
                      ? await addExerciseToPlaylist(playlist.id, currentExercise)
                      : currentPlaylist
                        ? await addPlaylistToPlaylist(playlist.id, currentPlaylist.id)
                        : null;
                  }}
                />
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuSub>
  );
}
