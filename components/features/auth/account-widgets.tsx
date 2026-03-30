import { getRandomAccount } from "@/lib/utils";
import { LikeButton } from "../../ui/custom-buttons";

export function MediumAccountWidget() {
  const account = getRandomAccount();
  return (
    <div className="relative group w-full cursor-pointer">
      <a
        href={`/account/${account.id}`}
        className="flex flex-col gap-2.5 items-center"
      >
        <div className="w-full aspect-square rounded-full overflow-hidden relative flex items-end justify-center">
          <LikeButton
            className={`opacity-0 z-1 group-hover:opacity-100 hidden md:flex`}
          />
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

        <h3
          className={`title-4 whitespace-nowrap overflow-hidden text-ellipsis transition group-hover:opacity-80}`}
        >
          {account.firstName} {account.lastName}
        </h3>
      </a>
    </div>
  );
}

export function MediumAccountWrapper() {
  return (
    <div className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {Array.from({ length: 50 }).map((_, i) => (
        <MediumAccountWidget key={i} />
      ))}
    </div>
  );
}
