import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { availableLanguages } from "@/config/language-pack";
import type { Language } from "@/types/i18n";
import type { Chord, Note } from "@/types/music";
import {
  onAddExerciseToPlaylist,
  onAddMultiExerciseToPlaylist,
  onAddPlaylistToPlaylist,
} from "@/telefunc/add-to-playlist.telefunc";
import { loadingToast } from "./toaster";
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
import type { Dispatch, MouseEvent, SetStateAction } from "react";
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

export const addPlaylistToPlaylist = async (
  target: PlaylistCardDto,
  playlistToAdd: PlaylistCardDto
) => {
  await loadingToast(onAddPlaylistToPlaylist(target.id, playlistToAdd.id), {
    loading: "Add to playlist...",
    success: () => ({ title: `${playlistToAdd.title} was added to ${target.title}` }),
  });
  reload();
};

export const addExerciseToPlaylist = async (
  playlist: PlaylistCardDto,
  exercise: ExerciseCardDto
) => {
  await loadingToast(onAddExerciseToPlaylist(playlist.id, exercise.id), {
    loading: "Add to playlist...",
    success: () => ({ title: `${exercise.title} was added to ${playlist.title}` }),
  });
  reload();
};

export const addManyExercisesToPlaylist = async (
  playlist: PlaylistCardDto,
  exercisesIds: number[]
) => {
  await loadingToast(onAddMultiExerciseToPlaylist(playlist.id, exercisesIds), {
    loading: "Add to playlist...",
    success: () => ({ title: `${exercisesIds.length} exercices added to ${playlist.title}` }),
  });
  reload();
};

export const deletePlaylist = async (playlistId: number) => {
  await loadingToast(onPlaylistRemove(playlistId), {
    loading: "Deleting...",
    success: () => ({ title: "Playlist deleted" }),
  });
  navigate("/");
};

export const handleLikeExercise = async (
  e: MouseEvent,
  isLiked: boolean,
  setIsLiked: Dispatch<SetStateAction<boolean>>,
  exercise: ExerciseCardDto
) => {
  e.preventDefault();
  e.stopPropagation();
  const action = isLiked ? onUserUnlikesExercise(exercise.id) : onUserLikesExercise(exercise.id);
  await loadingToast(action, {
    success: () => ({
      title: isLiked
        ? `${exercise.title} removed from your likes`
        : `${exercise.title} added to your likes`,
    }),
  });
  setIsLiked((prev) => !prev);
};

export const handleLikePlaylist = async (
  e: MouseEvent,
  isLiked: boolean,
  setIsLiked: Dispatch<SetStateAction<boolean>>,
  playlist: PlaylistCardDto
) => {
  e.preventDefault();
  e.stopPropagation();
  const action = isLiked ? onUserUnlikesPlaylist(playlist.id) : onUserLikesPlaylist(playlist.id);
  await loadingToast(action, {
    success: () => ({
      title: isLiked
        ? `${playlist.title} removed from your likes`
        : `${playlist.title} added to your likes`,
    }),
  });
  setIsLiked((prev) => !prev);
};

export const handleLikeAccount = async (
  e: MouseEvent,
  isLiked: boolean,
  setIsLiked: Dispatch<SetStateAction<boolean>>,
  account: UserCardDto
) => {
  e.preventDefault();
  e.stopPropagation();
  const action = isLiked ? onUserUnlikesUser(account.id) : onUserLikesUser(account.id);
  await loadingToast(action, {
    success: () => ({
      title: isLiked
        ? `${account.username} removed from your likes`
        : `${account.username} added to your likes`,
    }),
  });
  setIsLiked((prev) => !prev);
};

export const generateImageVariations = (url: string, resolutions: [number, number][]): string[] => {
  const patterns = {
    cloudinary: /(res\.cloudinary\.com\/.*\/upload\/)(v\d+\/.*)/,
    picsum: /(picsum\.photos\/seed\/[^/]+)\/\d+\/\d+/,
    google: /googleusercontent\.com\/[^\s=?]+/,
  };

  return resolutions.map(([width, height]) => {
    if (patterns.cloudinary.test(url)) {
      return url.replace(patterns.cloudinary, `$1w_${width},h_${height},c_fill/$2`);
    }
    if (patterns.picsum.test(url)) {
      return url.replace(patterns.picsum, `$1/${width}/${height}`);
    }
    if (patterns.google.test(url)) {
      const baseUrl = url.split(/[=?]/)[0];
      return `${baseUrl}=w${width}-h${height}-c`;
    }
    return url;
  });
};

export const musicalNotationRootNote = (note: Note): string => {
  return note.replace("b", "♭").replace("#", "♯");
};
