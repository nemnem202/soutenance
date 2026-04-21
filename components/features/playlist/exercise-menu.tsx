import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/organisms/dropdown-menu";
import Searchbar from "@/components/organisms/searchbar";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import { Album, ChevronRight, ListPlus, Trash, UserIcon } from "lucide-react";
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
import {
  addExerciseToPlaylist,
  addManyExercisesToPlaylist,
  addPlaylistToPlaylist,
} from "@/lib/utils";
import { SubContentHeader } from "../auth/account-menu";

export default function ExerciseContextMenuButton({
  exercise,
  playlistContext,
}: {
  exercise: ExerciseCardDto;
  playlistContext: PlaylistDetailDto;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { instance } = useLanguage();

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
      <ExerciseContextMenuContent exercise={exercise} playlistContext={playlistContext} />
    </DropdownMenu>
  );
}

function ExerciseContextMenuContent({
  exercise,
  playlistContext,
}: {
  exercise: ExerciseCardDto;
  playlistContext: PlaylistDetailDto;
}) {
  const [currentContent, setCurrentContent] = useState<"main" | "addToPlaylist">("main");

  return (
    <DropdownMenuContent
      className="bg-background p-0 z-1 max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[var(--radix-dropdown-menu-content-available-width)] overflow-y-auto"
      side="right"
      align="start"
    >
      {currentContent === "main" && (
        <ExerciseMainContent
          exercise={exercise}
          playlistContext={playlistContext}
          onAddToPlaylistClick={() => setCurrentContent("addToPlaylist")}
        />
      )}
      {currentContent === "addToPlaylist" && (
        <AddToPlaylistContent currentExercise={exercise} onBack={() => setCurrentContent("main")} />
      )}
    </DropdownMenuContent>
  );
}

function ExerciseMainContent({
  exercise,
  playlistContext,
  onAddToPlaylistClick,
}: {
  exercise: ExerciseCardDto;
  playlistContext: PlaylistDetailDto;
  onAddToPlaylistClick: () => void;
}) {
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
    </>
  );
}

export function AddToPlaylistContent({
  currentExercise,
  currentPlaylist,
  onBack,
}: {
  currentExercise?: ExerciseCardDto;
  currentPlaylist?: PlaylistCardDto;
  onBack: () => void;
}) {
  const { instance } = useLanguage();
  const { userPlaylists } = useData<Data>();

  return (
    <>
      <SubContentHeader action={onBack} title={instance.getItem("add_to_playlist")} />
      <Separator />
      <DropdownMenuGroup className="p-3">
        <Searchbar placeholder={instance.getItem("search")} />
      </DropdownMenuGroup>
      <DropdownMenuGroup className="p-3 pt-0 overflow-y-auto max-h-80 flex flex-col">
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
    </>
  );
}

export function MultiExerciseContextMenuButton({
  exercises,
  playlistContext,
}: {
  exercises: { id: number }[];
  playlistContext: PlaylistDetailDto;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { instance } = useLanguage();
  const [currentContent, setCurrentContent] = useState<"main" | "addToPlaylist">("main");
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
      <DropdownMenuContent
        className="bg-background p-0 z-1 max-h-[var(--radix-dropdown-menu-content-available-height)] max-w-[var(--radix-dropdown-menu-content-available-width)] overflow-y-auto"
        side="right"
        align="start"
      >
        {currentContent === "main" && (
          <MultiExercisesMainContent
            exercises={exercises}
            playlistContext={playlistContext}
            onAddToPlaylistClick={() => setCurrentContent("addToPlaylist")}
          />
        )}
        {currentContent === "addToPlaylist" && (
          <MultiAddToPlaylistContent
            exercises={exercises}
            currentPlaylist={playlistContext}
            onBack={() => setCurrentContent("main")}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MultiExercisesMainContent({
  exercises,
  playlistContext,
  onAddToPlaylistClick,
}: {
  exercises: { id: number }[];
  playlistContext: PlaylistDetailDto;
  onAddToPlaylistClick: () => void;
}) {
  const { instance } = useLanguage();
  const { session } = useSession();

  return (
    <DropdownMenuGroup className="p-3">
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onAddToPlaylistClick();
        }}
      >
        <ListPlus />
        {instance.getItem("add_to_playlist")} ({exercises.length})
        <ChevronRight className="ml-auto" />
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

export function MultiAddToPlaylistContent({
  exercises,
  currentPlaylist,
  onBack,
}: {
  exercises: { id: number }[];
  currentPlaylist: PlaylistCardDto;
  onBack: () => void;
}) {
  const { instance } = useLanguage();
  const { userPlaylists } = useData<Data>();

  return (
    <>
      <SubContentHeader
        action={onBack}
        title={`${instance.getItem("add_to_playlist")} (${exercises.length})`}
      />
      <Separator />
      <DropdownMenuGroup className="p-3">
        <Searchbar placeholder={instance.getItem("search")} />
      </DropdownMenuGroup>
      <DropdownMenuGroup className="p-3 pt-0 overflow-y-auto max-h-80 flex flex-col">
        <SmallAddNewPlaylistWidget />
        {userPlaylists.success &&
          userPlaylists.data.map((playlist) => (
            <DropdownMenuItem className="p-0" key={playlist.id}>
              <SmallAddToPlaylistWidget
                playlist={playlist}
                callBack={async () => {
                  await addManyExercisesToPlaylist(
                    playlist.id,
                    exercises.map((e) => e.id)
                  );
                }}
              />
            </DropdownMenuItem>
          ))}
      </DropdownMenuGroup>
    </>
  );
}
