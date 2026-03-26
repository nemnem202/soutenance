import { useData } from "vike-react/useData";
import { PlusButton } from "./custom-buttons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Data } from "@/pages/+data";
import { faker } from "@faker-js/faker";
import { SmallAddNewPlaylistWidget, SmallPlaylistWidget } from "./playlists-widgets";
import { Separator } from "./separator";
import Searchbar from "./searchbar";
import { useLanguage } from "@/hooks/use-language";

export default function AddToPlaylistButton() {
  const { playlists } = useData<Data>();
  const playlistsSubarray = faker.helpers.arrayElements(playlists, { min: 15, max: 20 });
  const { instance } = useLanguage();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <PlusButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background p-0 z-1" side="right" align="start">
        <DropdownMenuGroup className="p-3">
          <DropdownMenuLabel className="title-3">{instance.getItem("add_to_playlist")}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuGroup className="p-3">
          <Searchbar placeholder={instance.getItem("search")} />
        </DropdownMenuGroup>
        <DropdownMenuGroup className="p-3 overflow-y-auto  max-h-80 flex flex-col">
          <SmallAddNewPlaylistWidget />
          {playlistsSubarray.map((_, index) => (
            <DropdownMenuItem className="p-0" key={index}>
              <SmallPlaylistWidget />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
