import { getContext } from "telefunc";
import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";

export function onSessionRequest() {
  const context = getContext();
  return new SessionController({
    client: prismaClient,
    user: context.user,
  }).getSession();
}
