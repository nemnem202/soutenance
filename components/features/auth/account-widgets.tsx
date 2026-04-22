import { LikeButton } from "../../ui/custom-buttons";
import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { onUserLikesUser, onUserUnlikesUser } from "@/telefunc/like.telefunc";
import { errorToast, successToast } from "@/lib/toaster";
import type { UserCardDto } from "@/types/dtos/user";
import { logger } from "@/lib/logger";
import type { UserSeeAllQUery } from "@/types/navigation";
import { onUserSeeAllRequest } from "@/telefunc/see-all.telefunc";
import Image from "@/components/ui/image";

export function MediumAccountWidget({ account }: { account: UserCardDto }) {
  const [isLiked, setIsLiked] = useState(account.likedByCurrentUser);
  const handleLikeAccount = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLiked) {
      const response = await onUserUnlikesUser(account.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${account.username} was removed from your likes`);
        setIsLiked(false);
      }
    } else {
      const response = await onUserLikesUser(account.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${account.username} was added to your likes`);
        setIsLiked(true);
      }
    }
  };
  return (
    <div className="relative group w-full cursor-pointer max-w-60">
      <a href={`/account/${account.id}`} className="flex flex-col gap-2.5 items-center">
        <div className="w-full aspect-square rounded-full overflow-hidden relative flex items-end justify-center">
          <LikeButton
            className={`opacity-0 z-1 group-hover:opacity-100 hidden md:flex`}
            onClick={handleLikeAccount}
            liked={isLiked}
          />
          <div className={`absolute inset-0 transition group-hover:opacity-80`}>
            <Image
              src={account.profilePicture.url}
              alt={account.profilePicture.alt}
              className="w-full h-full object-cover"
              width={185}
              loading="lazy"
            />
          </div>
        </div>

        <h3
          className={`title-4 whitespace-nowrap overflow-hidden text-ellipsis transition group-hover:opacity-80}`}
        >
          {account.username}
        </h3>
      </a>
    </div>
  );
}

export function MediumAccountDynamicWrapper({
  initialAccounts,
  searchParam,
}: {
  initialAccounts: UserCardDto[];
  searchParam: UserSeeAllQUery;
}) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [pageIndex, setPageIndex] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = useCallback(async () => {
    logger.info("API CALL");
    const response = await onUserSeeAllRequest(searchParam, pageIndex * 40, 40);
    if (!response.success) return;
    setAccounts((prev) => [...prev, ...response.data]);
    setPageIndex((prev) => prev + 1);
  }, [pageIndex, searchParam]);

  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMoreItems();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreItems, isLoading]);

  return (
    <div
      ref={containerRef}
      className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]"
    >
      {accounts.map((account, i) => (
        <MediumAccountWidget key={i} account={account} />
      ))}
      {accounts.length < 5 &&
        Array.from({ length: 5 - accounts.length }).map((_, index) => (
          <div key={index} className="w-full max-w-60"></div>
        ))}

      <div
        ref={loaderRef}
        className="w-full max-w-60 aspect-square flex justify-center items-center"
      />
    </div>
  );
}

export function MediumAccountWrapper({ accounts }: { accounts: UserCardDto[] }) {
  return (
    <div className="grid gap-y-5 md:gap-y-4 gap-2 container grid-cols-[repeat(auto-fit,minmax(30vw,1fr))] md:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
      {accounts.map((account, i) => (
        <MediumAccountWidget key={i} account={account} />
      ))}
      {accounts.length < 5 &&
        Array.from({ length: 5 - accounts.length }).map((_, index) => (
          <div key={index} className="w-full max-w-60"></div>
        ))}
    </div>
  );
}
