import { SearchIcon } from "lucide-react";
import { navigate } from "vike/client/router";
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { useLanguage } from "@/hooks/use-language";
import useSearchbar from "@/hooks/use-searchbar";
import type { Session } from "@/types/auth";
import type { SoloExerciseCardDto } from "@/types/dtos/exercise";
import type { PlaylistCardDto } from "@/types/dtos/playlist";

export interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  const {
    isLoading,
    items,
    searchValue,
    setSearchValue,
    shouldRenderPopup,
    confirmValue,
    status,
    setOpen,
    open,
    previewValue,
    resetToUserInput,
    userInput,
  } = useSearchbar(props);
  return (
    <Autocomplete
      filter={null}
      items={items}
      onValueChange={setSearchValue}
      value={searchValue}
      onOpenChange={setOpen}
      open={open}
    >
      <AutocompleteInput
        placeholder={props.placeholder}
        showClear
        startAddon={<SearchIcon />}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            confirmValue(searchValue);
            navigate(`/search/${searchValue}`);
          }
        }}
      />
      {shouldRenderPopup && (
        <AutocompletePopup aria-busy={isLoading || undefined} onMouseLeave={resetToUserInput}>
          <AutocompleteStatus className="text-muted-foreground">{status}</AutocompleteStatus>
          <AutocompleteList>
            {items.map((item, index) => (
              <AutocompleteItem
                key={index}
                value={item.text}
                onMouseMove={() => previewValue(item.text)}
              >
                {item.item}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        </AutocompletePopup>
      )}
    </Autocomplete>
  );
}

export function UserSearchbarItem({
  user,
  closeSearchbar,
}: {
  user: Session;
  closeSearchbar: () => void;
}) {
  return (
    <button
      className="flex items-center gap-3 w-full h-full p-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSearchbar();
        navigate(`/account/${user.id}`);
      }}
      type="button"
    >
      <img
        src={user.profilePicture.url}
        alt={user.profilePicture.alt}
        className="w-15 h-15 object-cover overflow-hidden rounded-full"
      />
      <div className="flex flex-col justify-between">
        <p className="paragraph">{user.username}</p>
      </div>
    </button>
  );
}

export function ExerciseSearchbarItem({
  exercise,
  closeSearchbar,
}: {
  exercise: SoloExerciseCardDto;
  closeSearchbar: () => void;
}) {
  const { instance } = useLanguage();
  return (
    <button
      className="flex items-center gap-3 w-full h-full p-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSearchbar();
        navigate(`/game/${exercise.id}`);
      }}
      type="button"
    >
      <img
        src={exercise.cover.url}
        alt={exercise.cover.alt}
        className="w-15 h-15 object-cover overflow-hidden rounded-[0.2rem]"
      />
      <div className="flex flex-col justify-between items-start">
        <div className="flex gap-2">
          <p className="paragraph">{exercise.title}</p>
          <p className="paragraph text-muted-foreground">{exercise.composer}</p>
        </div>

        <div className="flex gap-2">
          <p className="paragraph-sm text-muted-foreground">{exercise.author.username}</p>
          <span className="paragraph-sm text-muted-foreground">-</span>
          <p className="paragraph-sm text-muted-foreground">
            {exercise.defaultConfig.bpm} {instance.getItem("bpm")}
          </p>
        </div>
      </div>
    </button>
  );
}

export function PlaylistSearchbarItem({
  playlist,
  closeSearchbar,
}: {
  playlist: PlaylistCardDto;
  closeSearchbar: () => void;
}) {
  const { instance } = useLanguage();
  return (
    <button
      className="flex items-center gap-3 w-full h-full p-1"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSearchbar();
        navigate(`/playlist/${playlist.id}`);
      }}
      type="button"
    >
      <img
        src={playlist.cover.url}
        alt={playlist.cover.alt}
        className="w-15 h-15 object-cover overflow-hidden rounded-[0.2rem]"
      />
      <div className="flex flex-col justify-between items-start ">
        <div className="flex gap-2">
          <p className="paragraph">{playlist.title}</p>
        </div>
        <div className="flex gap-2">
          <p className="paragraph-sm text-muted-foreground">{playlist.author.username}</p>
          <span className="paragraph-sm text-muted-foreground">-</span>
          <p className="paragraph-sm text-muted-foreground">
            {playlist.exercises.length} {instance.getItem("exercises")}
          </p>
        </div>
      </div>
    </button>
  );
}
