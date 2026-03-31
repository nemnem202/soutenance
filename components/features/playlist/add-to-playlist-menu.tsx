import { faker } from "@faker-js/faker";
import { useData } from "vike-react/useData";
import { useLanguage } from "@/hooks/use-language";
import type { Data } from "@/pages/+data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../organisms/dropdown-menu";
import Searchbar from "../../organisms/searchbar";
import { PlusButton } from "../../ui/custom-buttons";
import { Separator } from "../../ui/separator";
import {
  SmallAddNewPlaylistWidget,
  SmallPlaylistWidget,
} from "./playlists-widgets";

export default function AddToPlaylistButton() {
  const { playlists } = useData<Data>();
  const playlistsSubarray = faker.helpers.arrayElements(playlists, {
    min: 15,
    max: 20,
  });
  const { instance } = useLanguage();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <PlusButton />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-background p-0 z-1"
        side="right"
        align="start"
      >
        <DropdownMenuGroup className="p-3">
          <DropdownMenuLabel className="title-3">
            {instance.getItem("add_to_playlist")}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <Separator />
        <DropdownMenuGroup className="p-3">
          <Searchbar placeholder={instance.getItem("search")} />
        </DropdownMenuGroup>
        <DropdownMenuGroup className="p-3 pt-0 overflow-y-auto  max-h-80 flex flex-col">
          <SmallAddNewPlaylistWidget />
          {playlistsSubarray.map((playlist) => (
            <DropdownMenuItem className="p-0" key={playlist.id}>
              <SmallPlaylistWidget />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
