import { Playlist } from "@/types/project";
import { Checkbox } from "./checkbox";
import { Separator } from "./separator";
import { ReactNode } from "react";
import getPlaceholders from "@/pages/+data";
import { Badge } from "./badge";
import { LikeButton } from "./custom-buttons";

export function PlaylistItemsList({ playlist }: { playlist: Playlist }) {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between px-4 py-2">
        <p className="paragramh-md text-muted-foreground">Exercice</p>
        <div className="flex items-center">
          <PlaylistItemBox>
            <p className="paragraph-md text-muted-foreground">Bpm</p>
          </PlaylistItemBox>
          <PlaylistItemBox>
            <p className="paragraph-md text-muted-foreground">Pop</p>
          </PlaylistItemBox>
          <PlaylistItemBox>
            <Checkbox />
          </PlaylistItemBox>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full flex flex-col justify-between  py-0 mt-2">
        {playlist.exercicesIds.map((id, index) => (
          <PlaylistItem index={index} key={index} playlist={playlist} id={id} />
        ))}
      </div>
    </div>
  );
}

export function PlaylistItemBox({ children }: { children: ReactNode }) {
  return <div className={`w-12.5 flex justify-end`}>{children}</div>;
}

export interface PLaylistItemProps {
  index: number;
  playlist: Playlist;
  id: string;
}

export function PlaylistItem({ ...props }: PLaylistItemProps) {
  const exercice = getPlaceholders().EXERCICES_PLACEHOLDER.find((e) => e.id === props.id);
  if (!exercice) return null;

  return (
    <a
      className=" flex justify-between items-center py-1 my-1 relative cursor-pointer hover:bg-popover pr-4"
      href="/game"
    >
      <div className="flex items-center h-15">
        <img
          className="w-15 h-15"
          width={60}
          height={60}
          src={props.playlist.image.src}
          alt={props.playlist.image.alt}
        />
        <div className="flex h-fit gap-3">
          <div className="flex flex-col pl-2 gap-1">
            <p className="title-4">{exercice.title}</p>
            <p className="paragraph-md text-muted-foreground">{exercice.author}</p>
          </div>
          <div className="flex gap-1 h-full">
            {exercice.hasChords && (
              <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                chords
              </Badge>
            )}

            {exercice.haseMelody && (
              <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                melody
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <PlaylistItemBox>
          <LikeButton />
        </PlaylistItemBox>
        <PlaylistItemBox>
          <p className="paragraph-md text-muted-foreground">{exercice.config.bpm}</p>
        </PlaylistItemBox>
        <PlaylistItemBox>
          <p className="paragraph-md">
            |||<span className="text-muted-foreground">|||</span>
          </p>
        </PlaylistItemBox>
        <PlaylistItemBox>
          <Checkbox />
        </PlaylistItemBox>
      </div>
    </a>
  );
}
