import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import ArrowElipsisTopMenu from "@/components/features/layout/arrow-elipsis-top-menu";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import Searchbar from "@/components/organisms/searchbar";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { UserDetailsDto } from "@/types/dtos/user";
import type { Data } from "./+data";
import { LikeButton } from "@/components/ui/custom-buttons";
import { DropdownMenuContent } from "@/components/organisms/dropdown-menu";
import { handleLikeAccount } from "@/lib/utils";
import Image from "@/components/ui/image";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const { currentAccount } = useData<Data>();

  useEffect(() => {
    if (!currentAccount.success) navigate("/404");
  }, [currentAccount.success]);

  const account = currentAccount.success ? currentAccount.data : null;

  if (!account) return null;

  if (!account) return null;
  return (
    <div className="flex flex-col">
      <SizeAdapter
        sm={
          <ArrowElipsisTopMenu
            menuContent={<DropdownMenuContent>Account controls</DropdownMenuContent>}
          />
        }
      />
      <section>
        <Banner account={account} />
      </section>
      <section>
        <Content user={account} />
      </section>
    </div>
  );
}
function Banner({ account }: { account: UserDetailsDto }) {
  const { instance } = useLanguage();
  const [isLiked, setIsLiked] = useState(account.likedByCurrentUser);

  return (
    <div className="flex w-full md:flex-row flex-col gap-8 items-center relative">
      <SizeAdapter
        md={
          <div className="absolute right-2 top-2 z-1">
            <LikeButton
              onClick={(e) => {
                handleLikeAccount(e, isLiked, setIsLiked, account);
              }}
              liked={isLiked}
            />
          </div>
        }
      />
      <div className="w-50 md:w-75 rounded-full aspect-square overflow-hidden">
        <Image
          src={account.profilePicture.url}
          alt={account.profilePicture.alt}
          width={300}
          height={300}
          loading="lazy"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 md:items-start items-center">
        <h1 className="headline h-min w-fit">{account.username}</h1>
        <div className="flex flex-col gap-3">
          <p className="title-4 text-muted-foreground ">
            {account.publicPlaylists.length} {instance.getItem("playlists")}
          </p>
        </div>
        <SizeAdapter
          sm={
            <LikeButton
              onClick={(e) => {
                handleLikeAccount(e, isLiked, setIsLiked, account);
              }}
              liked={isLiked}
            />
          }
        />
      </div>
    </div>
  );
}

function Content({ user }: { user: UserDetailsDto }) {
  const { session } = useSession();
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder={instance.getItem("search")} />
      </div>
      <div className="flex  gap-x-auto gap-y-5 flex-wrap container">
        <MediumPlaylistWrapper playlists={user.publicPlaylists} />
      </div>
    </div>
  );
}
