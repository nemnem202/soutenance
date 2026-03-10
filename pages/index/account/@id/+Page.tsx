import { MediumPlaylistWrapper } from "@/components/playlists-widgets";
import Searchbar from "@/components/searchbar";
import { useLanguage } from "@/hooks/use-language";
import { Data } from "@/pages/+data";
import { Account } from "@/types/account";
import { useEffect, useState } from "react";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const account = useData<Data>().accounts.find((e) => e.id === id);

  useEffect(() => {
    if (!account) navigate("/404");
  }, []);

  if (!account) return null;
  return (
    <div className="flex flex-col ">
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
    <div className="flex w-full gap-8 items-center">
      <div className="w-75 rounded-full aspect-square overflow-hidden">
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
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder={instance.getItem("search_in_playlist")} />
      </div>
      <div className="flex  gap-x-auto gap-y-5 flex-wrap container">
        <MediumPlaylistWrapper />
      </div>
    </div>
  );
}
