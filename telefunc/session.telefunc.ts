import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";
import { getContext } from "telefunc";

export function onSessionRequest() {
  const context = getContext();
  return new SessionController({ client: prismaClient, context }).getSession();
}
