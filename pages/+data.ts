import type { PageContextServer } from "vike/types";
import { getGlobalData } from "@/lib/global-data";

export default async function data(pageContext: PageContextServer) {
  const [globalData] = await Promise.all([getGlobalData(pageContext)]);

  return { ...globalData };
}
export type Data = Awaited<ReturnType<typeof data>>;
