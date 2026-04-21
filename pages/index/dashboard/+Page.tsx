import { useEffect } from "react";
import { navigate } from "vike/client/router";
import { useData } from "vike-react/useData";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";
import SizeAdapter from "@/components/molecules/size-adapter";
import Searchbar from "@/components/organisms/searchbar";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { UserDetailsDto } from "@/types/dtos/user";
import type { Data } from "./+data";
import Headline from "@/components/ui/headline";
import MobileHeader from "@/components/features/layout/mobile-header";

export default function Page() {
  return <SizeAdapter sm={<Mobile />} md={<Desktop />} />;
}

function Desktop() {
  const { currentAccount } = useData<Data>();
  const { instance } = useLanguage();

  useEffect(() => {
    if (!currentAccount.success) navigate("/404");
  }, [currentAccount.success]);

  const account = currentAccount.success ? currentAccount.data : null;

  if (!account) return null;
  return (
    <div className="flex flex-col">
      <Headline>{instance.getItem("dashboard")}</Headline>
      <section>
        <Content user={account} />
      </section>
    </div>
  );
}

function Mobile() {
  const { currentAccount } = useData<Data>();
  const { instance } = useLanguage();

  useEffect(() => {
    if (!currentAccount.success) navigate("/404");
  }, [currentAccount.success]);

  const account = currentAccount.success ? currentAccount.data : null;
  if (!account) return null;
  return (
    <>
      <MobileHeader title={instance.getItem("dashboard")} />
      <Content user={account} />
    </>
  );
}

function Content({ user }: { user: UserDetailsDto }) {
  const { session } = useSession();
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 mb-9 md:my-9">
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
