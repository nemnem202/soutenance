import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import Searchbar from "@/components/organisms/searchbar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import { Ellipsis } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { SmallAddNewPlaylistWidget, SmallAddToPlaylistWidget } from "./playlists-widgets";
import { useData } from "vike-react/useData";
import type { Data } from "@/pages/+data";
import { loadingToast } from "@/lib/toaster";
import { reload } from "vike/client/router";
import { onAddExerciseToPlaylist } from "@/telefunc/add-to-playlist.telefunc";

export default function ExerciseContextMenuButton({ exercise }: { exercise: ExerciseCardDto }) {
  const { instance } = useLanguage();
  const { userPlaylists } = useData<Data>();
  const [isOpen, setIsOpen] = useState(false);

  const addExerciseToPlaylist = async (targetId: number) => {
    const responsePromise = onAddExerciseToPlaylist(targetId, exercise.id);
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
