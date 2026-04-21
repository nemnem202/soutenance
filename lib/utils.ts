import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { availableLanguages } from "@/config/language-pack";
import type { Language } from "@/types/i18n";
import type { Chord } from "@/types/music";
import {
  onAddExerciseToPlaylist,
  onAddPlaylistToPlaylist,
} from "@/telefunc/add-to-playlist.telefunc";
import { errorToast, loadingToast, successToast } from "./toaster";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import { navigate, reload } from "vike/client/router";
import { onPlaylistRemove } from "@/telefunc/playlist.telefunc";
import {
  onUserLikesExercise,
  onUserLikesPlaylist,
  onUserLikesUser,
  onUserUnlikesExercise,
  onUserUnlikesPlaylist,
  onUserUnlikesUser,
} from "@/telefunc/like.telefunc";
import type { MouseEvent } from "react";
import type { UserCardDto } from "@/types/dtos/user";
import type { PlaylistCardDto } from "@/types/dtos/playlist";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPreferredLanguage = (header: string | null): Language => {
  if (!header) return availableLanguages[0];

  const langs = header.split(",").map((part) => part.split(";")[0].trim());

  for (const lang of langs) {
    const base = lang.split("-")[0];
    if (availableLanguages.includes(lang as Language)) return lang as Language;
    if (availableLanguages.includes(base as Language)) return base as Language;
  }

  return availableLanguages[0];
};

export const chordToString = (chord: Chord) =>
  `${chord.content.note} ${chord.content.modifier ?? ""} ${chord.over && `${chord.over.note} ${chord.over.modifier}`}`;

export const addPlaylistToPlaylist = async (targetId: number, playlistToAddId: number) => {
  const responsePromise = onAddPlaylistToPlaylist(targetId, playlistToAddId);
  loadingToast(responsePromise);
  await responsePromise;
};

export const addExerciseToPlaylist = async (targetId: number, exercise: ExerciseCardDto) => {
  const responsePromise = onAddExerciseToPlaylist(targetId, exercise.id);
  loadingToast(responsePromise);
  await responsePromise;
  reload();
};

export const deletePlaylist = async (playlistId: number) => {
  const responsePromise = onPlaylistRemove(playlistId);
  loadingToast(responsePromise);
  await responsePromise;
  navigate("/");
};

export const handleLikeExercise = async (
  e: MouseEvent,
  isLiked: boolean,
  setIsLiked: (value: boolean) => void,
  exercise: ExerciseCardDto
) => {
  e.preventDefault();
  e.stopPropagation();
  if (isLiked) {
    const response = await onUserUnlikesExercise(exercise.id);
    if (!response.success) {
      errorToast(response.title, response.description);
    } else {
      successToast(`${exercise.title} was removed from your likes`);
      setIsLiked(false);
    }
  } else {
    const response = await onUserLikesExercise(exercise.id);
    if (!response.success) {
      errorToast(response.title, response.description);
    } else {
      successToast(`${exercise.title} was added to your likes`);
      setIsLiked(true);
      reload();
    }
  }
};

export const handleLikePlaylist = async (
  e: MouseEvent,
  isLiked: boolean,
  setIsLiked: (value: boolean) => void,
  playlist: PlaylistCardDto
) => {
  e.preventDefault();
  e.stopPropagation();
  if (isLiked) {
    const response = await onUserUnlikesPlaylist(playlist.id);
    if (!response.success) {
      errorToast(response.title, response.description);
    } else {
      successToast(`${playlist.title} was removed from your likes`);
      setIsLiked(false);
    }
  } else {
    const response = await onUserLikesPlaylist(playlist.id);
    if (!response.success) {
      errorToast(response.title, response.description);
    } else {
      successToast(`${playlist.title} was added to your likes`);
      setIsLiked(true);
      reload();
    }
  }
};

export const handleLikeAccount = async (
  e: MouseEvent,
  isLiked: boolean,
  setIsLiked: (value: boolean) => void,
  account: UserCardDto
) => {
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
      reload();
    }
  }
};
