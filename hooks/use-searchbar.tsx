import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  ExerciseSearchbarItem,
  PlaylistSearchbarItem,
  type SearchbarProps,
  UserSearchbarItem,
} from "@/components/organisms/searchbar";
import { Spinner } from "@/components/ui/spinner";
import { logger } from "@/lib/logger";
import { errorToast } from "@/lib/toaster";
import type { AnySearch } from "@/repositories/searchRepository";
import onSearch from "@/telefunc/search.telefunc";

export default function useSearchbar({ ...props }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AnySearch | undefined>(undefined);
  const [items, setItems] = useState<{ rank: number; item: ReactNode; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleSearchChange = (val: string) => {
    if (!val) {
      setSearchValue("");
      setUserInput("");
      setSearchResults(undefined);
      return;
    }
    setSearchValue(val);
    setUserInput(val);
  };

  const resetToUserInput = () => {
    setSearchValue(userInput);
  };

  const previewValue = (val: string) => {
    setSearchValue(val);
  };

  const confirmValue = useCallback((val: string) => {
    setSearchValue(val);
    setUserInput(val);
  }, []);

  useEffect(() => {
    if (!userInput || userInput.length <= 0) {
      setSearchResults(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    let ignore = false;

    const timeoutId = setTimeout(async () => {
      try {
        const results = await onSearch(userInput, 0, 10);
        if (!results.success) return errorToast(results.title, results.description);

        if (!ignore) setSearchResults(results.data);
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
  }, [userInput]);

  useEffect(() => {
    logger.info("results", searchResults);
    if (!searchResults) return;
    const exercisesItems = searchResults.exercises.map((exercise) => {
      const text = `${exercise.title} - ${exercise.author.username}`;
      return {
        rank: exercise.rank,
        text,
        item: (
          <ExerciseSearchbarItem
            key={exercise.id}
            exercise={exercise}
            closeSearchbar={() => {
              confirmValue(text);
              setOpen(false);
            }}
          />
        ),
      };
    });

    const playlistsItems = searchResults.playlists.map((playlist) => {
      const text = `${playlist.title} - ${playlist.author.username}`;
      return {
        rank: playlist.rank,
        text,
        item: (
          <PlaylistSearchbarItem
            key={playlist.id}
            playlist={playlist}
            closeSearchbar={() => {
              confirmValue(text);
              setOpen(false);
            }}
          />
        ),
      };
    });

    const usersItems = searchResults.users.map((user) => {
      const text = `${user.username}`;
      return {
        rank: user.rank,
        text,
        item: (
          <UserSearchbarItem
            key={user.id}
            user={user}
            closeSearchbar={() => {
              confirmValue(text);
              setOpen(false);
            }}
          />
        ),
      };
    });

    setItems(
      [...exercisesItems, ...playlistsItems, ...usersItems]
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 5)
    );
  }, [searchResults, confirmValue]);

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
    setSearchValue: handleSearchChange,
    previewValue,
    resetToUserInput,
    confirmValue,
    userInput,
    isLoading,
    items,
    status,
    shouldRenderPopup,
    open,
    setOpen,
  };
}
