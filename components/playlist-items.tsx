import { Exercise, Playlist } from "@/types/project";
import { Checkbox } from "./checkbox";
import { Separator } from "./separator";
import { ReactNode, useState } from "react";
import { useData } from "vike-react/useData";

import { Badge } from "./badge";
import { LikeButton } from "./custom-buttons";
import { WidgetTitle } from "./widget-carousel";
import { useLanguage } from "@/hooks/use-language";
import { Data } from "@/pages/+data";
import { getRandomPlaylist } from "@/lib/utils";
import SizeAdapter from "./size-adapter";

export function PlaylistItemsList({ playlist }: { playlist: Playlist }) {
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="w-full flex justify-between px-4 py-2">
        <p className="paragramh-md text-muted-foreground">{instance.getItem("exercise")}</p>
        <div className="flex items-center">
          <PlaylistItemBox>
            <p className="paragraph-md text-muted-foreground">{instance.getItem("bpm")}</p>
          </PlaylistItemBox>
          <SizeAdapter
            md={
              <PlaylistItemBox>
                <p className="paragraph-md text-muted-foreground">{instance.getItem("pop")}</p>
              </PlaylistItemBox>
            }
          />
          <PlaylistItemBox>
            <Checkbox />
          </PlaylistItemBox>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full flex flex-col justify-between  py-0 mt-2">
        {playlist.exercisesIds.map((id, index) => (
          <PlaylistItem index={index} key={index} playlist={playlist} id={id} />
        ))}
      </div>
    </div>
  );
}

export function PlaylistItemBox({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`md:min-w-12.5 min-w-8 flex justify-end ${className}`}>{children}</div>;
}

export interface PLaylistItemProps {
  index: number;
  playlist: Playlist;
  id: string;
}

export function PlaylistItem({ ...props }: PLaylistItemProps) {
  const { instance } = useLanguage();
  const exercise = useData<Data>().exercises.find((e) => e.id === props.id);
  if (!exercise) return null;

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

        <div className="flex flex-1 min-w-0 h-fit gap-3">
          <div className="flex flex-1 flex-col min-w-0 pl-2 gap-1">
            <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{exercise.title}</p>
            <p className="paragraph-md text-muted-foreground">{exercise.author}</p>
          </div>

          <SizeAdapter
            md={
              <div className="flex gap-1 h-full">
                {exercise.hasChords && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("chords")}
                  </Badge>
                )}

                {exercise.haseMelody && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("melody").toLowerCase()}
                  </Badge>
                )}
              </div>
            }
          />
        </div>
      </div>
      <div className="flex items-center">
        <PlaylistItemBox>
          <LikeButton />
        </PlaylistItemBox>
        <PlaylistItemBox>
          <p className="paragraph-md text-muted-foreground">{exercise.config.bpm}</p>
        </PlaylistItemBox>
        <SizeAdapter
          md={
            <PlaylistItemBox>
              <p className="paragraph-md">
                |||<span className="text-muted-foreground">|||</span>
              </p>
            </PlaylistItemBox>
          }
        />
        <PlaylistItemBox>
          <Checkbox />
        </PlaylistItemBox>
      </div>
    </a>
  );
}

export function SearchPlaylistItem({ ...props }: PLaylistItemProps) {
  const { instance } = useLanguage();
  const exercise = useData<Data>().exercises.find((e) => e.id === props.id);
  if (!exercise) return null;

  return (
    <a
      className="flex justify-between items-center py-1 my-1 relative cursor-pointer hover:bg-popover pr-4"
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
        <div className="flex flex-1 min-w-0 h-fit gap-3">
          <div className="flex flex-1 flex-col min-w-0 pl-2 gap-1">
            <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{exercise.title}</p>
            <p className="paragraph-md text-muted-foreground">{exercise.author}</p>
          </div>

          <SizeAdapter
            md={
              <div className="flex gap-1 h-full">
                {exercise.hasChords && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("chords")}
                  </Badge>
                )}

                {exercise.haseMelody && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("melody").toLowerCase()}
                  </Badge>
                )}
              </div>
            }
          />
        </div>
      </div>

      <div className="flex items-center">
        <SizeAdapter
          md={
            <PlaylistItemBox className="w-40 min-w-40 justify-start">
              <p className="paragraph-md text-muted-foreground">{exercise.account.firstName}</p>
            </PlaylistItemBox>
          }
        />

        <PlaylistItemBox>
          <LikeButton />
        </PlaylistItemBox>

        <PlaylistItemBox>
          <p className="paragraph-md text-muted-foreground">{exercise.config.bpm}</p>
        </PlaylistItemBox>

        <SizeAdapter
          md={
            <PlaylistItemBox>
              <p className="paragraph-md text-muted-foreground">{instance.getItem("pop")}</p>
            </PlaylistItemBox>
          }
        />

        {/* <PlaylistItemBox>
          <Checkbox />
        </PlaylistItemBox> */}
      </div>
    </a>
  );
}

export function SearchPlaylistItemsList({ playlist }: { playlist: Playlist }) {
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="w-full flex justify-between pr-4 py-2">
        <div></div>
        <div className="flex items-center">
          <SizeAdapter
            md={
              <PlaylistItemBox className="w-40 min-w-40 justify-start">
                <p className="paragraph-md text-muted-foreground">{instance.getItem("user")}</p>
              </PlaylistItemBox>
            }
            sm={
              <PlaylistItemBox>
                <></>
              </PlaylistItemBox>
            }
          />

          <PlaylistItemBox>
            <></>
          </PlaylistItemBox>

          <PlaylistItemBox>
            <p className="paragraph-md text-muted-foreground">{instance.getItem("bpm")}</p>
          </PlaylistItemBox>

          <SizeAdapter
            md={
              <PlaylistItemBox>
                <p className="paragraph-md text-muted-foreground">{instance.getItem("pop")}</p>
              </PlaylistItemBox>
            }
          />

          {/* <PlaylistItemBox>
            <Checkbox />
          </PlaylistItemBox> */}
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="w-full flex flex-col justify-between py-0 mt-2">
        {playlist.exercisesIds.map((id, index) => (
          <SearchPlaylistItem index={index} key={index} playlist={playlist} id={id} />
        ))}
      </div>
    </div>
  );
}

export function SearchExercisesList({ seeAllUrl = "#" }: { seeAllUrl?: string }) {
  const playlist = getRandomPlaylist();
  return (
    <div className="flex flex-col mx-auto mb-6 container">
      <WidgetTitle title="Exercises" seeAllUrl={seeAllUrl} />
      <SearchPlaylistItemsList playlist={playlist} />
    </div>
  );
}
