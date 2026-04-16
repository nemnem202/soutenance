import { Plus } from "lucide-react";
import { useState } from "react";
import { LikeButton } from "@/components/ui/custom-buttons";
import { useLanguage } from "@/hooks/use-language";
import type { PlaylistCardDto } from "@/types/dtos/playlist";
import AddToPlaylistButton from "./add-to-playlist-menu";
import NewPlaylistModal from "./new-playlist-modal";
import { onUserLikesPlaylist, onUserUnlikesPlaylist } from "@/telefunc/like.telefunc";
import { errorToast, successToast } from "@/lib/toaster";

export function SmallPlaylistWidget({ playlist }: { playlist: PlaylistCardDto }) {
  const { instance } = useLanguage();
  return (
    <a
      className=" w-full hover:bg-popover rounded flex gap-2 cursor-pointer transition p-1.5"
      href={`/playlist/${playlist.id}`}
    >
      <div className="h-12 w-12 aspect-square overflow-hidden">
        <img
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
  const handleLikePlaylist = async () => {
    if (isLiked) {
      const response = await onUserUnlikesPlaylist(playlist.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${playlist.title} was removed from your likes`);
        setIsLiked(false);
      }
    } else {
      const response = await onUserLikesPlaylist(playlist.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${playlist.title} was added to your likes`);
        setIsLiked(true);
      }
    }
  };
  return (
    <div className="relative group w-full max-w-60">
      <div className="absolute top-0 left-0 px-2 pt-2 w-full z-1 flex justify-between  opacity-0 group-hover:opacity-100 transition pointer-events-none hidden md:flex">
        <div className="pointer-events-auto">
          <AddToPlaylistButton />
        </div>
        <div className="pointer-events-auto ">
          <LikeButton onClick={handleLikePlaylist} liked={isLiked} />
        </div>
      </div>
      <div className="cursor-pointer rounded-md transition group-hover:opacity-80">
        <a href={`/playlist/${playlist.id}`} className="flex flex-col rounded gap-2.5">
          <div className="w-full aspect-square rounded overflow-hidden">
            <img
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
  allowToAddANewPlaylist,
  playlists,
}: {
  allowToAddANewPlaylist?: boolean;
  playlists: PlaylistCardDto[];
}) {
  return (
    <div className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {allowToAddANewPlaylist && <MediumAddNewPlaylistWidget />}
      {playlists.map((playlist, i) => (
        <MediumPlaylistWidget key={i} playlist={playlist} />
      ))}
      {playlists.length < 5 &&
        Array.from({ length: 5 - playlists.length }).map((_, index) => (
          <div key={index} className="w-full max-w-60"></div>
        ))}
    </div>
  );
}
