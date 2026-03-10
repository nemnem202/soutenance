import { useState } from "react";
import { LikeButton } from "./custom-buttons";
import { useData } from "vike-react/useData";
import { Data } from "@/pages/+data";
import { getRandomAccount } from "@/lib/utils";

export function MediumAccountWidget() {
  const account = getRandomAccount();
  return (
    <div className="w-55 cursor-pointer group">
      <a href={`/account/${account.id}`} className="flex flex-col gap-2.5 items-center">
        <div className="w-full aspect-square rounded-full overflow-hidden relative flex items-end justify-center">
          <LikeButton className={`opacity-0 z-1 group-hover:opacity-100`} />
          <div className={`absolute inset-0 transition group-hover:opacity-80`}>
            <img
              src={account.picture}
              alt={account.picture}
              className="w-full h-full object-cover"
              width={185}
              loading="lazy"
            />
          </div>
        </div>

        <h3 className={`title-4 whitespace-nowrap overflow-hidden text-ellipsis transition group-hover:opacity-80}`}>
          {account.firstName} {account.lastName}
        </h3>
      </a>
    </div>
  );
}

export function MediumAccountWrapper() {
  return (
    <div className="flex justify-between gap-4 gap-y-5 flex-wrap container">
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          //  className="mr-6.5"
          key={index}
        >
          <MediumAccountWidget />
        </div>
      ))}
    </div>
  );
}
