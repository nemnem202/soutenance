import type { ExerciseCardDto } from "@/types/dtos/exercise";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../molecules/input-group";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import type { UserCardDto } from "@/types/dtos/user";
import { Search } from "lucide-react";
import type { ChangeEvent } from "react";

export interface FilterSearchbarExercises {
  placeholder: string;
  items: ExerciseCardDto[];
  onUpdate: (items: ExerciseCardDto[]) => void;
  type: "exercises";
}

export interface FilterSearchbarPlaylists {
  placeholder: string;
  items: PlaylistCardDto[];
  onUpdate: (items: PlaylistCardDto[]) => void;
  type: "playlists";
}

export interface FilterSearchbarUsers {
  placeholder: string;
  items: UserCardDto[];
  onUpdate: (items: UserCardDto[]) => void;
  type: "users";
}

export default function FilterSearchbar({
  ...props
}: FilterSearchbarExercises | FilterSearchbarPlaylists | FilterSearchbarUsers) {
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    switch (props.type) {
      case "exercises":
        return props.onUpdate(
          props.items.filter(
            (e) =>
              e.author.username.toLowerCase().includes(value) ||
              e.composer.toLowerCase().includes(value) ||
              e.title.toLowerCase().includes(value)
          )
        );
      case "playlists":
        return props.onUpdate(
          props.items.filter(
            (e) =>
              e.author.username.toLowerCase().includes(value) ||
              e.title.toLowerCase().includes(value)
          )
        );

      case "users":
        return props.onUpdate(props.items.filter((e) => e.username.toLowerCase().includes(value)));
    }
  };
  return (
    <InputGroup onChange={handleValueChange}>
      <InputGroupInput placeholder={props.placeholder} />
      <InputGroupAddon className="pl-3">
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
