import { getGlobalData } from "@/lib/global-data";
import { getPopularPlaylists } from "@/telefunc/homepage.telefunc";
import type { PageContextServer } from "vike/types";

export default async function data(pageContext: PageContextServer) {
  const [globalData, popular] = await Promise.all([
    getGlobalData(pageContext),
    getPopularPlaylists(),
  ]);

  return { ...globalData, popular };
}
export type Data = Awaited<ReturnType<typeof data>>;
