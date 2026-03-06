import { getRandomAccount } from "@/pages/+data";
import { useState } from "react";

export function MediumAccountWidget() {
  const [account] = useState(getRandomAccount());

  return (
    <div className=" w-55 cursor-pointer hover:opacity-80 transition">
      <a href={`/account/${account.id}`} className="flex flex-col gap-2.5 items-center">
        <div className="w-full aspect-square rounded-full overflow-hidden">
          <img src={account.picture} alt={account.picture} className="w-full h-full object-cover" width={185} />
        </div>

        <h3 className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">
          {account.firstName} {account.lastName}
        </h3>
      </a>
    </div>
  );
}
