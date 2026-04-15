import { useEffect } from "react";
import { navigate } from "vike/client/router";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import ArrowElipsisTopMenu from "@/components/features/layout/arrow-elipsis-top-menu";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import Searchbar from "@/components/organisms/searchbar";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { Session } from "@/types/auth";
import type { UserDetailsDto } from "@/types/dtos/user";
import type { Data } from "./+data";

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
      <SizeAdapter sm={<ArrowElipsisTopMenu />} />
      <section>
        <Banner account={account} />
      </section>
      <section>
        <Content user={account} />
      </section>
    </div>
  );
}
function Banner({ account }: { account: Session }) {
  return (
    <div className="flex w-full md:flex-row flex-col gap-8 items-center">
      <div className="w-50 md:w-75 rounded-full aspect-square overflow-hidden">
        <img
          src={account.profilePicture.url}
          alt={account.profilePicture.alt}
          width={300}
          height={300}
          loading="lazy"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <h1 className="headline h-min">{account.username}</h1>
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
        <MediumPlaylistWrapper
          allowToAddANewPlaylist={user.id === session?.id}
          playlists={user.publicPlaylists}
        />
      </div>
    </div>
  );
}
