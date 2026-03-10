import { Data } from "@/pages/+data";
import { Account } from "@/types/account";
import { Exercice, Playlist } from "@/types/project";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useData } from "vike-react/useData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomAccount = (): Account => {
  const accounts = useData<Data>().accounts;
  const randomIndex = Math.floor(Math.random() * accounts.length);
  return accounts[randomIndex];
};

export const getRandomPlaylist = (): Playlist => {
  const playlists = useData<Data>().playlists;
  const randomIndex = Math.floor(Math.random() * playlists.length);
  return playlists[randomIndex];
};
