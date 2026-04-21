import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LikeButton } from "@/components/ui/custom-buttons";
import { useLanguage } from "@/hooks/use-language";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import AddToPlaylistButton from "./add-to-playlist-menu";
import NewPlaylistModal from "./new-playlist-modal";
import { logger } from "@/lib/logger";
import type { PlaylistSeeAllQUery } from "@/types/navigation";
import { onPlaylistSeeAllRequest } from "@/telefunc/see-all.telefunc";
import { handleLikePlaylist } from "@/lib/utils";
import Image from "@/components/ui/image";

export function SmallPlaylistWidget({ playlist }: { playlist: PlaylistCardDto }) {
  const { instance } = useLanguage();
  return (
    <a
      className=" w-full hover:bg-popover rounded flex gap-2 cursor-pointer transition p-1.5"
      href={`/playlist/${playlist.id}`}
    >
      <div className="h-12 w-12 aspect-square overflow-hidden">
        <Image
          src={playlist.cover.url}
          alt={playlist.cover.alt}
          className="object-cover h-full w-full"
          width={48}
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{playlist.title}</p>
        <p className="paragraph-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          {instance.getItem("by")} {playlist.author.username}
        </p>
      </div>
    </a>
  );
}

export function SmallAddToPlaylistWidget({
  playlist,
  callBack,
}: {
  playlist: PlaylistCardDto;
  callBack: () => Promise<void>;
}) {
  const { instance } = useLanguage();

  return (
    <button
      type="button"
      className="all-unset w-full hover:bg-popover rounded flex gap-2 cursor-pointer text-left transition p-1.5"
      onClick={callBack}
    >
      <div className="h-12 w-12 aspect-square overflow-hidden">
        <Image
          src={playlist.cover.url}
          alt={playlist.cover.alt}
          className="object-cover h-full w-full"
          width={48}
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{playlist.title}</p>
        <p className="paragraph-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          {instance.getItem("by")} {playlist.author.username}
        </p>
      </div>
    </button>
  );
}

export function SmallAddNewPlaylistWidget() {
  const { instance } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NewPlaylistModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className=" w-full hover:bg-popover rounded flex gap-2 cursor-pointer transition p-1.5 text-primary"
      >
        <div className="h-12 w-12 aspect-square overflow-hidden bg-popover flex items-center justify-center">
          <Plus />
        </div>
        <div className="flex flex-1 flex-col min-w-0 justify-center">
          <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis w-min ">
            {instance.getItem("new_playlist")}
          </p>
        </div>
      </button>
    </NewPlaylistModal>
  );
}

export function MediumPlaylistWidget({ playlist }: { playlist: PlaylistCardDto }) {
  const [isLiked, setIsLiked] = useState(playlist.likedByCurrentUser);
  const { instance } = useLanguage();

  return (
    <div className="relative group w-full max-w-60">
      <div className="absolute top-0 left-0 px-2 pt-2 w-full z-1 flex justify-between  opacity-0 group-hover:opacity-100 transition pointer-events-none hidden md:flex">
        <div className="pointer-events-auto">
          <AddToPlaylistButton playlistToAddId={playlist.id} />
        </div>
        <div className="pointer-events-auto ">
          <LikeButton
            onClick={(e) => {
              handleLikePlaylist(e, isLiked, setIsLiked, playlist);
            }}
            liked={isLiked}
          />
        </div>
      </div>
      <div className="cursor-pointer rounded-md transition group-hover:opacity-80">
        <a href={`/playlist/${playlist.id}`} className="flex flex-col rounded gap-2.5">
          <div className="w-full aspect-square rounded overflow-hidden">
            <Image
              src={playlist.cover.url}
              alt={playlist.cover.alt}
              className="w-full h-full object-cover"
              width={185}
              loading="lazy"
            />
          </div>

          <div className="flex-col flex w-full">
            <h3 className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">
              {playlist.title}
            </h3>

            <div className="w-full justify-between paragraph-sm text-muted-foreground flex wrap">
              <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]">
                {instance.getItem("by")} {playlist.author.username}
              </p>
              <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[15%]">
                {playlist.exercises.length > 99 ? ">99" : playlist.exercises.length}
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
    <div className="w-full cursor-pointer hover:opacity-80 rounded-md transition max-w-60">
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

export function MediumPlaylistWrapper({
  playlists,
  allowToAddANewPlaylist,
}: {
  playlists: PlaylistCardDto[];
  allowToAddANewPlaylist?: boolean;
}) {
  return (
    <div className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {allowToAddANewPlaylist && <MediumAddNewPlaylistWidget />}
      {playlists &&
        playlists.length > 0 &&
        playlists.map((playlist, i) => <MediumPlaylistWidget key={i} playlist={playlist} />)}
      {playlists.length < 5 &&
        Array.from({ length: 5 - playlists.length }).map((_, index) => (
          <div key={index} className="w-full max-w-60"></div>
        ))}
      <div className="w-full max-w-60 aspect-square flex justify-center items-center" />
    </div>
  );
}

export function MediumDynamicPlaylistWrapper({
  allowToAddANewPlaylist,
  initialPlaylists,
  searchParam,
}: {
  allowToAddANewPlaylist?: boolean;
  initialPlaylists: PlaylistCardDto[];
  searchParam: PlaylistSeeAllQUery;
}) {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [pageIndex, setPageIndex] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = useCallback(async () => {
    logger.info("API CALL");
    const response = await onPlaylistSeeAllRequest(searchParam, pageIndex * 40, 40);
    if (!response.success) return;
    setPlaylists((prev) => [...prev, ...response.data]);
    setPageIndex((prev) => prev + 1);
  }, [pageIndex, searchParam]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMoreItems();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreItems, isLoading]);
  return (
    <div
      ref={containerRef}
      className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]"
    >
      {allowToAddANewPlaylist && <MediumAddNewPlaylistWidget />}
      {playlists &&
        playlists.length > 0 &&
        playlists.map((playlist, i) => <MediumPlaylistWidget key={i} playlist={playlist} />)}
      {playlists.length < 5 &&
        Array.from({ length: 5 - playlists.length }).map((_, index) => (
          <div key={index} className="w-full max-w-60"></div>
        ))}
      <div
        ref={loaderRef}
        className="w-full max-w-60 aspect-square flex justify-center items-center"
      />
    </div>
  );
}
