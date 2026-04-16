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
import { Album, Ellipsis, Trash, UserIcon } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { SmallAddNewPlaylistWidget, SmallAddToPlaylistWidget } from "./playlists-widgets";
import { useData } from "vike-react/useData";
import type { Data } from "@/pages/+data";
import { loadingToast } from "@/lib/toaster";
import { reload } from "vike/client/router";
import { onAddExerciseToPlaylist } from "@/telefunc/add-to-playlist.telefunc";
import useSession from "@/hooks/use-session";
import type { PlaylistDetailDto } from "@/types/dtos/playlist";
import { onRemoveExerciseFromPlaylist } from "@/telefunc/remove-from-playlist.telefunc";

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
        <MenuButton setOpen={setIsOpen} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background p-0 z-1" side="right" align="start">
        <DropdownMenuGroup className="p-3">
          <DropdownSubMenuAddToPlaylist exercise={exercise} />
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

function MenuButton({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  return (
    <button
      className="all-unset cursor-pointer hover:bg-popover-2 rounded-full h-5 w-5 transition flex items-center justify-center"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(true);
      }}
    >
      <Ellipsis className="h-4 w-4" />
    </button>
  );
}

function DropdownSubMenuAddToPlaylist({ exercise }: { exercise: ExerciseCardDto }) {
  const { instance } = useLanguage();
  const { userPlaylists } = useData<Data>();

  const addExerciseToPlaylist = async (targetId: number) => {
    const responsePromise = onAddExerciseToPlaylist(targetId, exercise.id);
    loadingToast(responsePromise);
    await responsePromise;
    reload();
  };
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
                  callBack={() => addExerciseToPlaylist(playlist.id)}
                />
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenuSub>
  );
}
