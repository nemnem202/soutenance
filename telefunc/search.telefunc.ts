import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import SearchRepository from "@/repositories/searchRepository";

export default async function onSearch(
  query: string,
  start: number | undefined = 0,
  length: number | undefined = 20
) {
  const repository = new SearchRepository(prismaClient);
  return handleAction("Get search result", () => {
    return repository.getAny(query, start, length);
  });
}
