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
import { AnySearch } from "@/repositories/searchRepository";
import onSearch from "@/telefunc/search.telefunc";
import { errorToast } from "@/lib/toaster";
import { logger } from "@/lib/logger";

export interface SearchbarProps {
  placeholder: string;
}

export default function Searchbar({ ...props }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AnySearch | undefined>(undefined);
  const [items, setItems] = useState<ReactNode[]>([]);
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

    const exercisesItems = searchResults?.exercises.map((exercise) => (
      <div key={exercise.id}>Exercise: {exercise.title}</div>
    ));

    const playlistsItems = searchResults.ex;
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
    status = (
      <span className="font-normal text-muted-foreground text-sm">
        Movie or year "{searchValue}" does not exist in the Top 100 IMDb movies
      </span>
    );
  }

  const shouldRenderPopup = searchValue !== "";

  return (
    <Autocomplete
      filter={null}
      items={items}
      // itemToStringValue={(item: unknown) => (item as Movie).title}
      onValueChange={setSearchValue}
      value={searchValue}
    >
      <AutocompleteInput placeholder={props.placeholder} showClear startAddon={<SearchIcon />} />
      {shouldRenderPopup && (
        <AutocompletePopup aria-busy={isLoading || undefined}>
          <AutocompleteStatus className="text-muted-foreground">{status}</AutocompleteStatus>
          <AutocompleteList>
            {/* {(movie: Movie) => (
              <AutocompleteItem key={movie.id} value={movie}>
                <div className="flex w-full flex-col gap-1">
                  <div className="font-medium">{movie.title}</div>
                  <div className="text-muted-foreground text-xs">{movie.year}</div>
                </div>
              </AutocompleteItem>
            )} */}
          </AutocompleteList>
        </AutocompletePopup>
      )}
    </Autocomplete>
  );
}
