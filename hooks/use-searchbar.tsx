import type { SearchbarProps } from "@/components/organisms/searchbar";
import { faker } from "@faker-js/faker";
import { History, Search } from "lucide-react";
import { type ChangeEvent, type JSX, useEffect, useState } from "react";

interface DatasetItem {
  content: string;
  inHistory: boolean;
}

interface DropdownItem {
  id: number;
  label: string;
  icon?: JSX.Element;
}

const dataset: DatasetItem[] = Array.from({ length: 500 }).map(() => ({
  content: faker.music.songName() + " - " + faker.music.artist(),
  inHistory: Math.random() > 0.9,
}));

export default function useSearchbar({ ...props }: SearchbarProps) {
  const defineItemsFromString = (value: string) => {
    const matching = dataset.filter((item) => item.content.toLowerCase().includes(value));

    const matchingHistory = matching.filter((item) => item.inHistory);
    const matchingSearch = matching.filter((item) => !item.inHistory);

    const ordered = [...matchingHistory, ...matchingSearch];

    const completed: DatasetItem[] = [...ordered].slice(0, 5);

    const results = completed.map<DropdownItem>((item, i) => ({
      id: i,
      label: item.content,
      icon: item.inHistory ? (
        <History className="stroke-muted-foreground w-5" />
      ) : (
        <Search className="stroke-muted-foreground w-5" />
      ),
    }));

    if (results.length === 0) {
      results[0] = {
        id: 0,
        label: "No matching found.",
      };
    }

    return results;
  };
  const [searchbarValue, setSearchbarValue] = useState("");
  const [items, setItems] = useState<DropdownItem[]>(defineItemsFromString(""));
  const [placeholder, setPlaceholder] = useState(props.placeholder);

  useEffect(() => {
    setPlaceholder(props.placeholder);
  }, [props.placeholder]);

  const handleInputValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();

    const results = defineItemsFromString(value);

    setItems(results);
    setSearchbarValue(value);
  };

  return { items, handleInputValueChange, searchbarValue, setSearchbarValue, placeholder, setPlaceholder };
}
