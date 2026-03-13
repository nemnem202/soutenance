import { useState } from "react";
import { Plus } from "lucide-react";
import { LikeButton, PlusButton } from "./custom-buttons";
import { useLanguage } from "@/hooks/use-language";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/+data";
import { getRandomPlaylist } from "@/lib/utils";

export function SmallPlaylistWidget() {
  const playlist = getRandomPlaylist();
  const { instance } = useLanguage();
  return (
    <a
      className="h-12 w-full hover:bg-popover rounded flex gap-2 cursor-pointer transition"
      href={`/playlist/${playlist.id}`}
    >
      <div className="h-12 w-12 aspect-square overflow-hidden">
        <img
          src={playlist.image.src}
          alt={playlist.image.alt}
          className="object-cover h-full w-full"
          width={48}
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{playlist.title}</p>
        <p className="paragraph-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          {instance.getItem("by")} {playlist.author}
        </p>
      </div>
    </a>
  );
}

export function MediumPlaylistWidget() {
  const playlist = getRandomPlaylist();
  const { instance } = useLanguage();
  return (
    <div className="relative group w-full">
      <div className="absolute top-0 left-0 px-2 pt-2 w-full z-1 flex justify-between  opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="pointer-events-auto">
          <PlusButton />
        </div>
        <div className="pointer-events-auto">
          <LikeButton />
        </div>
      </div>
      <div className="cursor-pointer rounded-md transition group-hover:opacity-80">
        <a href={`/playlist/${playlist.id}`} className="flex flex-col rounded gap-2.5">
          <div className="w-full aspect-square rounded overflow-hidden">
            <img
              src={playlist.image.src}
              alt={playlist.image.alt}
              className="w-full h-full object-cover"
              width={185}
              loading="lazy"
            />
          </div>

          <div className="flex-col flex w-full">
            <h3 className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{playlist.title}</h3>

            <div className="w-full justify-between paragraph-sm text-muted-foreground flex wrap">
              <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">
                {instance.getItem("by")} {playlist.author}
              </p>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[15%]">
                {playlist.exercicesIds.length > 99 ? ">99" : playlist.exercicesIds.length}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

function MediumAddNewPlaylistWidget() {
  const { instance } = useLanguage();
  return (
    <div className="w-full cursor-pointer hover:opacity-80 rounded-md transition">
      <a href="/new-playlist" className="flex flex-col rounded gap-2.5">
        <div className="w-full aspect-square rounded overflow-hidden bg-card flex items-center justify-center">
          <Plus size={100} />
        </div>

        <div className="flex-col flex w-full">
          <h3 className="title-4">{instance.getItem("new_playlist")}</h3>
        </div>
      </a>
    </div>
  );
}

export function MediumPlaylistWrapper({ allowToAddANewPlaylist }: { allowToAddANewPlaylist?: boolean }) {
  return (
    <div className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {allowToAddANewPlaylist && <MediumAddNewPlaylistWidget />}
      {Array.from({ length: 50 }).map((_, index) => (
        <MediumPlaylistWidget key={index} />
      ))}
    </div>
  );
}
