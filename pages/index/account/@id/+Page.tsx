import { MediumPlaylistWrapper } from "@/components/playlists-widgets";
import Searchbar from "@/components/searchbar";
import getPlaceholders from "@/pages/+data";
import { Account } from "@/types/account";
import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const [account] = useState(getPlaceholders().ACCOUNTS_PLACEHOLDER.find((e) => e.id === id));

  if (!account) return null;
  return (
    <div className="flex flex-col ">
      <section>
        <Banner account={account} />
      </section>
      <section>
        <Content account={account} />
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

function Content({ account }: { account: Account }) {
  const exercices = getPlaceholders().EXERCICES_PLACEHOLDER;
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder="search exercices of this account" />
      </div>
      <div className="flex  gap-x-auto gap-y-5 flex-wrap container">
        <MediumPlaylistWrapper />
      </div>
    </div>
  );
}
