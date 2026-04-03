import { getContext } from "telefunc";
import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";
import { handleAction } from "@/lib/response-handler";

export async function onSessionRequest() {
  const context = getContext();
  return handleAction("Fetch Session", async () => {
    const userId = context.user?.id ?? null;
    const session = await new SessionController({ client: prismaClient }).getSession(userId);
    return { session };
  });
}
