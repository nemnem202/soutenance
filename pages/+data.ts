import { getGlobalData } from "@/lib/global-data";
import type { PageContextServer } from "vike/types";

export default async function data(pageContext: PageContextServer) {
  const [globalData] = await Promise.all([getGlobalData(pageContext)]);

  return { ...globalData };
}
export type Data = Awaited<ReturnType<typeof data>>;
