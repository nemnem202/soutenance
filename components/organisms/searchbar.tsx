import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePopup,
  AutocompleteStatus,
  useAutocompleteFilter,
} from "@/components/ui/autocomplete";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SearchIcon } from "lucide-react";
import type { AnySearch } from "@/repositories/searchRepository";
import onSearch from "@/telefunc/search.telefunc";
import { errorToast } from "@/lib/toaster";
import { logger } from "@/lib/logger";
import { navigate } from "vike/client/router";
import type { Session } from "@/types/auth";
import type { SoloExerciseCardDto } from "@/types/dtos/exercise";
import type { PlaylistCardDto } from "@/types/dtos/playlist";

export interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AnySearch | undefined>(undefined);
  const [items, setItems] = useState<{ rank: number; item: ReactNode; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { contains } = useAutocompleteFilter({ sensitivity: "base" });

  useEffect(() => {
    if (!searchValue || searchValue.length <= 0) {
      setSearchResults(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    let ignore = false;

    const timeoutId = setTimeout(async () => {
      try {
        const results = await onSearch(searchValue, 0, 10);
        if (!results.success) return errorToast(results.title, results.description);
        setSearchResults(results.data);
      } catch {
        if (!ignore) {
          setError("Failed to get suggestions. Please try again.");
          setSearchResults(undefined);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      ignore = true;
    };
  }, [searchValue]);

  useEffect(() => {
    logger.info("results", searchResults);
    if (!searchResults) return;
    const exercisesItems = searchResults.exercises.map((exercise) => ({
      rank: exercise.rank,
      text: `${exercise.title} - ${exercise.author.username}`,
      item: <ExerciseSearchbarItem key={exercise.id} exercise={exercise} />,
    }));

    const playlistsItems = searchResults.playlists.map((playlist) => ({
      rank: playlist.rank,
      text: `${playlist.title} - ${playlist.author.username}`,
      item: <PlaylistSearchbarItem key={playlist.id} playlist={playlist} />,
    }));

    const usersItems = searchResults.users.map((user) => ({
      rank: user.rank,
      text: `${user.username}`,
      item: <UserSearchbarItem key={user.id} user={user} />,
    }));

    setItems(
      [...exercisesItems, ...playlistsItems, ...usersItems]
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5)
    );
  }, [searchResults]);

  let status: ReactNode = `${items.length} result${items.length === 1 ? "" : "s"} found`;
  if (isLoading) {
    status = (
      <span className="flex items-center justify-between gap-2 text-muted-foreground">
        Searching...
        <Spinner className="size-4.5 sm:size-4" />
      </span>
    );
  } else if (error) {
    status = <span className="font-normal text-destructive text-sm">{error}</span>;
  } else if (items.length === 0 && searchValue) {
    status = <span className="font-normal text-muted-foreground text-sm">Not found</span>;
  }

  const shouldRenderPopup = searchValue !== "";

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

function UserSearchbarItem({ user }: { user: Session }) {
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

function ExerciseSearchbarItem({ exercise }: { exercise: SoloExerciseCardDto }) {
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

function PlaylistSearchbarItem({ playlist }: { playlist: PlaylistCardDto }) {
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
