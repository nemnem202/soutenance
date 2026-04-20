import { useEffect } from "react";
import { navigate } from "vike/client/router";
import { useData } from "vike-react/useData";
import ArrowElipsisTopMenu from "@/components/features/layout/arrow-elipsis-top-menu";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import Searchbar from "@/components/organisms/searchbar";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { UserDetailsDto } from "@/types/dtos/user";
import type { Data } from "./+data";
import Headline from "@/components/ui/headline";
import { AccountMenuContent } from "@/components/features/auth/account-menu";

export default function Page() {
  const { currentAccount } = useData<Data>();
  const { instance } = useLanguage();

  useEffect(() => {
    if (!currentAccount.success) navigate("/404");
  }, [currentAccount.success]);

  const account = currentAccount.success ? currentAccount.data : null;

  if (!account) return null;

  if (!account) return null;
  return (
    <div className="flex flex-col">
      <SizeAdapter sm={<ArrowElipsisTopMenu menuContent={<AccountMenuContent />} />} />
      <Headline>{instance.getItem("dashboard")}</Headline>
      <section>
        <Content user={account} />
      </section>
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
