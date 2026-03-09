import { useState } from "react";
import { Plus } from "lucide-react";
import { getRandomPlaylist } from "@/pages/+data";

export function SmallPlaylistWidget() {
  const [playlist, setPlaylist] = useState(getRandomPlaylist());
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
          by {playlist.author}
        </p>
      </div>
    </a>
  );
}

export function MediumPlaylistWidget() {
  const [playlist, setPlaylist] = useState(getRandomPlaylist());

  return (
    <div className="w-55 cursor-pointer hover:opacity-80 rounded-md transition">
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
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">by {playlist.author}</p>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[15%]">
              {playlist.exercicesIds.length > 99 ? ">99" : playlist.exercicesIds.length}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}

function MediumAddNewPlaylistWidget() {
  return (
    <div className="w-55 cursor-pointer hover:opacity-80 rounded-md transition">
      <a href="/new-playlist" className="flex flex-col rounded gap-2.5">
        <div className="w-full aspect-square rounded overflow-hidden bg-card flex items-center justify-center">
          <Plus size={100} />
        </div>

        <div className="flex-col flex w-full">
          <h3 className="title-4">New Playlist</h3>
        </div>
      </a>
    </div>
  );
}

export function MediumPlaylistWrapper({ allowToAddANewPlaylist }: { allowToAddANewPlaylist?: boolean }) {
  return (
    <div className="flex justify-between gap-4 gap-y-5 flex-wrap container">
      {allowToAddANewPlaylist && (
        <div
        //  className="mr-6.5"
        >
          <MediumAddNewPlaylistWidget />
        </div>
      )}
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          //  className="mr-6.5"
          key={index}
        >
          <MediumPlaylistWidget />
        </div>
      ))}
    </div>
  );
}
