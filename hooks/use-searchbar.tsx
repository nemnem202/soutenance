import {
  ExerciseSearchbarItem,
  PlaylistSearchbarItem,
  UserSearchbarItem,
  type SearchbarProps,
} from "@/components/organisms/searchbar";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { AnySearch } from "@/repositories/searchRepository";
import onSearch from "@/telefunc/search.telefunc";
import { errorToast } from "@/lib/toaster";
import { logger } from "@/lib/logger";

export default function useSearchbar({ ...props }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AnySearch | undefined>(undefined);
  const [items, setItems] = useState<{ rank: number; item: ReactNode; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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
      item: (
        <ExerciseSearchbarItem
          key={exercise.id}
          exercise={exercise}
          closeSearchbar={() => setOpen(false)}
        />
      ),
    }));

    const playlistsItems = searchResults.playlists.map((playlist) => ({
      rank: playlist.rank,
      text: `${playlist.title} - ${playlist.author.username}`,
      item: (
        <PlaylistSearchbarItem
          key={playlist.id}
          playlist={playlist}
          closeSearchbar={() => setOpen(false)}
        />
      ),
    }));

    const usersItems = searchResults.users.map((user) => ({
      rank: user.rank,
      text: `${user.username}`,
      item: <UserSearchbarItem key={user.id} user={user} closeSearchbar={() => setOpen(false)} />,
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

  return {
    searchValue,
    setSearchValue,
    isLoading,
    items,
    status,
    shouldRenderPopup,
    open,
    setOpen,
  };
}
