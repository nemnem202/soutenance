import { getGlobalData } from "@/lib/global-data";
import { getDiscoverPlaylists, getPopularPlaylists } from "@/telefunc/homepage.telefunc";
import type { PageContextServer } from "vike/types";

export default async function data(pageContext: PageContextServer) {
  const [globalData, popular, discover] = await Promise.all([
    getGlobalData(pageContext),
    getPopularPlaylists(),
    getDiscoverPlaylists(),
  ]);

  return { ...globalData, popular, discover };
}
export type Data = Awaited<ReturnType<typeof data>>;
