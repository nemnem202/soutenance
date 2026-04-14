import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { SearchIcon } from "lucide-react";
import { navigate } from "vike/client/router";
import type { Session } from "@/types/auth";
import type { SoloExerciseCardDto } from "@/types/dtos/exercise";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import useSearchbar from "@/hooks/use-searchbar";

export interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  const { isLoading, items, searchValue, setSearchValue, shouldRenderPopup, status } =
    useSearchbar(props);
  return (
    <Autocomplete filter={null} items={items} onValueChange={setSearchValue} value={searchValue}>
      <AutocompleteInput
        placeholder={props.placeholder}
        showClear
        startAddon={<SearchIcon />}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/search/${searchValue}`);
          }
        }}
      />
      {shouldRenderPopup && (
        <AutocompletePopup aria-busy={isLoading || undefined}>
          <AutocompleteStatus className="text-muted-foreground">{status}</AutocompleteStatus>
          <AutocompleteList>
            {items.map((item, index) => (
              <AutocompleteItem key={index} value={item.text}>
                {item.item}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
        </AutocompletePopup>
      )}
    </Autocomplete>
  );
}

export function UserSearchbarItem({ user }: { user: Session }) {
  return (
    <button
      className="flex items-center gap-3"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/account/${user.id}`);
      }}
      type="button"
    >
      <img
        src={user.profilePicture.url}
        alt={user.profilePicture.alt}
        className="w-15 h-15 object-cover overflow-hidden rounded-full"
      />
      <p className="paragraph">{user.username}</p>
    </button>
  );
}

export function ExerciseSearchbarItem({ exercise }: { exercise: SoloExerciseCardDto }) {
  return (
    <button
      className="flex items-center gap-3"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/game/${exercise.id}`);
      }}
      type="button"
    >
      <img
        src={exercise.cover.url}
        alt={exercise.cover.alt}
        className="w-15 h-15 object-cover overflow-hidden"
      />
      <p className="paragraph">{exercise.title}</p>
    </button>
  );
}

export function PlaylistSearchbarItem({ playlist }: { playlist: PlaylistCardDto }) {
  return (
    <button
      className="flex items-center gap-3"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/playlist/${playlist.id}`);
      }}
      type="button"
    >
      <img
        src={playlist.cover.url}
        alt={playlist.cover.alt}
        className="w-15 h-15 object-cover overflow-hidden"
      />
      <p className="paragraph">{playlist.title}</p>
    </button>
  );
}
