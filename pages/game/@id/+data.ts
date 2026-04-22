import { getAuthenticatedSession } from "@/lib/global-data";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";
import GameRepository from "@/repositories/gameRepository";
import { Exercise } from "@/types/entities";
import { ServerResponse, Status } from "@/types/server-response";
import { PageContextServer } from "vike/types";

export default async function data(
  pageContext: PageContextServer
): Promise<ServerResponse<Exercise>> {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const userId = session?.id ?? null;
  const id = pageContext.routeParams.id ? parseInt(pageContext.routeParams.id, 10) : null;
  if (!id)
    return {
      success: false,
      status: Status.BadRequest,
      title: "Incorrect Exercise id",
    };
  const repository = new GameRepository(prismaClient);
  return handleAction("get Exercise from id", () => repository.findOne(id, null));
}
export type Data = Awaited<ReturnType<typeof data>>;
