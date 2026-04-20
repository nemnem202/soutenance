export const PLAYLIST_SEE_ALL_QUERY = ["recent", "discover", "popular"] as const;

export type PlaylistSeeAllQUery = (typeof PLAYLIST_SEE_ALL_QUERY)[number];

export type UserSeeAllQUery = "popular";

export type SeeAllType = "account" | "playlist";
