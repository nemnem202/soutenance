import { getRandomAccount } from "@/pages/+data";
import { useState } from "react";
import { LikeButton } from "./custom-buttons";

export function MediumAccountWidget() {
  const [account] = useState(getRandomAccount());
  const [hover, setHover] = useState(false);
  return (
    <div className=" w-55 cursor-pointer" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <a href={`/account/${account.id}`} className="flex flex-col gap-2.5 items-center">
        <div className="w-full aspect-square rounded-full overflow-hidden relative flex items-end justify-center">
          <LikeButton className={`opacity-0 z-1 ${hover && "opacity-100"}`} />
          <div className={`absolute inset-0 transition ${hover && "opacity-80"}`}>
            <img
              src={account.picture}
              alt={account.picture}
              className="w-full h-full object-cover"
              width={185}
              loading="lazy"
            />
          </div>
        </div>

        <h3 className={`title-4 whitespace-nowrap overflow-hidden text-ellipsis transition ${hover && "opacity-80"}`}>
          {account.firstName} {account.lastName}
        </h3>
      </a>
    </div>
  );
}
