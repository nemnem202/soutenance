import ArrowElipsisTopMenu from "@/components/features/layout/arrow-elipsis-top-menu";
import Searchbar from "@/components/organisms/searchbar";
import SizeAdapter from "@/components/molecules/size-adapter";
import { useLanguage } from "@/hooks/use-language";
import useSession from "@/hooks/use-session";
import type { Data } from "@/pages/+data";
import type { Account } from "@/types/entities";
import { useEffect } from "react";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { MediumPlaylistWrapper } from "@/components/features/playlist/playlists-widgets";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const account = useData<Data>().accounts.find((e) => e.id === id);

  useEffect(() => {
    if (!account) navigate("/404");
  }, []);

  if (!account) return null;
  return (
    <div className="flex flex-col">
      <SizeAdapter sm={<ArrowElipsisTopMenu />} />
      <section>
        <Banner account={account} />
      </section>
      <section>
        <Content />
      </section>
    </div>
  );
}
function Banner({ account }: { account: Account }) {
  return (
    <div className="flex w-full md:flex-row flex-col gap-8 items-center">
      <div className="w-50 md:w-75 rounded-full aspect-square overflow-hidden">
        <img
          src={account.picture}
          alt={"An image of " + account.firstName + " " + account.lastName}
          width={300}
          height={300}
          loading="lazy"
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <h1 className="headline h-min">
          {account.firstName} {account.lastName}
        </h1>
      </div>
    </div>
  );
}

function Content() {
  const { id } = usePageContext().routeParams;
  const { session } = useSession();
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder={instance.getItem("search")} />
      </div>
      <div className="flex  gap-x-auto gap-y-5 flex-wrap container">
        <MediumPlaylistWrapper allowToAddANewPlaylist={id === session?.userId} />
      </div>
    </div>
  );
}
