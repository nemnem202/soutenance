import AccountPP from "@/components/account-pp";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { LikeButton, PlusButton } from "@/components/custom-buttons";
import { PlaylistItemsList } from "@/components/playlist-items";
import Searchbar from "@/components/searchbar";
import { Separator } from "@/components/separator";
import { useLanguage } from "@/hooks/use-language";
import { Data } from "@/pages/+data";
import { Playlist } from "@/types/project";
import { Heart } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const [playlist] = useState(useData<Data>().playlists.find((e) => e.id === id));

  useEffect(() => {
    if (!playlist) navigate("/404");
  }, []);

  if (!playlist) return null;
  return (
    <div className="flex flex-col ">
      <section>
        <Banner playlist={playlist} />
      </section>
      <section>
        <Content playlist={playlist} />
      </section>
    </div>
  );
}

function Banner({ playlist }: { playlist: Playlist }) {
  const { instance } = useLanguage();
  const account = useData<Data>().accounts.find((account) => account.id === playlist.accountId);
  return (
    <div className="flex w-full gap-8 items-center relative">
      <div className="absolute right-2 top-2 z-1">
        <PlusButton />
        <LikeButton />
      </div>
      <div className="w-75 rounded aspect-square overflow-hidden">
        <img
          src={playlist.image.src}
          alt={playlist.image.alt}
          width={300}
          height={300}
          loading="lazy"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <h1 className="headline h-min">{playlist.title}</h1>
        <div className="flex flex-col gap-3">
          {account && (
            <a
              href={"/account/" + account.id}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            >
              <AccountPP image={account.picture} />
              <p className="title-4">{playlist.author}</p>
            </a>
          )}

          <div className="flex gap-2">
            <p className="text-muted-foreground">
              {playlist.exercicesIds.length} {instance.getItem("exercices").toLowerCase()}
            </p>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground">{instance.getItem("medium")}</p>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground">{instance.getItem("pop").toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content({ playlist }: { playlist: Playlist }) {
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder={instance.getItem("search_in_playlist")} />
      </div>
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}
