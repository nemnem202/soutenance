import AccountPP from "@/components/account-pp";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { LikeButton } from "@/components/custom-buttons";
import Searchbar from "@/components/searchbar";
import { Separator } from "@/components/separator";
import getPlaceholders from "@/pages/+data";
import { Playlist } from "@/types/project";
import { Heart } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const [playlist] = useState(getPlaceholders().PROJECTS_PLACEHOLDERS.find((e) => e.id === id));

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
  const account = getPlaceholders().ACCOUNTS_PLACEHOLDER.find((account) => account.id === playlist.accountId);
  return (
    <div className="flex w-full gap-8 items-center">
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
              <AccountPP account={account} />
              <p className="title-4">{playlist.author}</p>
            </a>
          )}

          <div className="flex gap-2">
            <p className="text-muted-foreground">{playlist.exercicesIds.length} exercices</p>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground">medium</p>
            <Separator orientation="vertical" />
            <p className="text-muted-foreground">pop</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content({ playlist }: { playlist: Playlist }) {
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder="search the playlist" />
      </div>
      <PlaylistItemsList playlist={playlist} />
    </div>
  );
}

function PlaylistItemsList({ playlist }: { playlist: Playlist }) {
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

function PlaylistItemBox({ children }: { children: ReactNode }) {
  return <div className={`w-12.5 flex justify-end`}>{children}</div>;
}

interface PLaylistItemProps {
  index: number;
  playlist: Playlist;
  id: string;
}

function PlaylistItem({ ...props }: PLaylistItemProps) {
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
