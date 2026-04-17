import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import SearchRepository from "@/repositories/searchRepository";
import { getContext } from "telefunc";
export default async function onSearch(
  query: string,
  start: number | undefined = 0,
  length: number | undefined = 20
) {
  const repository = new SearchRepository(prismaClient);
  const context = getContext();
  const userId = context.user?.id ?? null;
  return handleAction("Get search result", () => {
    return repository.getAny(query, userId, start, length);
  });
}
