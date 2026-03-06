import { getRandomArtist } from "@/pages/+data";
import { useState } from "react";

export function MediumArtistWidget() {
  const [artist] = useState(getRandomArtist());

  return (
    <div className=" w-50 cursor-pointer hover:opacity-90 transition">
      <a href={`/playlist/${artist.id}`} className="flex flex-col gap-2.5 items-center">
        <div className="w-full aspect-square rounded-full overflow-hidden">
          <img src={artist.picture} alt={artist.picture} className="w-full h-full object-cover" width={185} />
        </div>

        <h3 className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">
          {artist.firstName} {artist.lastName}
        </h3>
      </a>
    </div>
  );
}
