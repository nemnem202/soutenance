import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import ArrowElipsisTopMenu from "@/components/features/layout/arrow-elipsis-top-menu";
import { PlaylistItemsList } from "@/components/features/playlist/playlist-items";
import SizeAdapter from "@/components/molecules/size-adapter";
import Searchbar from "@/components/organisms/searchbar";
import AccountPP from "@/components/ui/account-pp";
import { LikeButton, PlusButton } from "@/components/ui/custom-buttons";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { Data } from "@/pages/+data";
import type { Playlist } from "@/types/entities";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const [playlist] = useState(useData<Data>().playlists.find((e) => String(e.id) === id));

  useEffect(() => {
    if (!playlist) navigate("/404");
  }, [playlist]);

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
    <div className="flex md:flex-row gap-0 md:gap-8 flex-col w-full items-center relative">
      <SizeAdapter
        md={
          <div className="absolute right-2 top-2 z-1">
            <PlusButton />
            <LikeButton />
          </div>
        }
        sm={<ArrowElipsisTopMenu />}
      />

      <div className="w-50 md:w-75 md:m-0 rounded aspect-square overflow-hidden mb-8 mt-2">
        <img
          src={playlist.image.src}
          alt={playlist.image.alt}
          width={300}
          height={300}
          loading="lazy"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col justify-center md:items-start w-full md:items-center gap-0 md:gap-2 flex-1">
        <h1 className="headline h-min">{playlist.title}</h1>
        <div className="flex flex-col gap-3">
          {account && (
            <a
              href={`/account/${account.id}`}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
            >
              <SizeAdapter
                md={<AccountPP image={{ alt: "Placeholder", src: account.picture }} />}
              />
              <p className="title-4 md:text-foreground text-muted-foreground ">{playlist.author}</p>
            </a>
          )}

          <SizeAdapter
            md={
              <div className="flex gap-2">
                <p className="text-muted-foreground">
                  {playlist.exercisesIds.length} {instance.getItem("exercises").toLowerCase()}
                </p>
                <Separator orientation="vertical" />
                <p className="text-muted-foreground">{instance.getItem("medium")}</p>
                <Separator orientation="vertical" />
                <p className="text-muted-foreground">{instance.getItem("pop").toLowerCase()}</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

function Content({ playlist }: { playlist: Playlist }) {
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 md:my-9 my-3 md:pt-9">
        <Searchbar placeholder={instance.getItem("search_in_playlist")} />
      </div>
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}
