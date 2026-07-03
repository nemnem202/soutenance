import { MMAGrooveTitle, SectionType } from "@/lib/generated/prisma/enums";

export const PLAYLIST_SEE_ALL_QUERY = ["recent", "discover", "popular"] as const;

export type PlaylistSeeAllQUery = (typeof PLAYLIST_SEE_ALL_QUERY)[number];

export type UserSeeAllQUery = "popular";

export type SeeAllType = "account" | "playlist";

export interface Filters {
  search?: string;
  groove?: MMAGrooveTitle;
  key?: string;
  bpmMin?: number;
  bpmMax?: number;
  sectionTypes?: SectionType[];
  chordNotes?: string[];
}
