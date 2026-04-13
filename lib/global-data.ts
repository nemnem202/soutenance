import { UAParser } from "ua-parser-js";
import type { PageContextServer } from "vike/types";
import SessionController from "@/controllers/SessionController";
import prismaClient from "@/lib/prisma-client";
import { getPreferredLanguage } from "@/lib/utils";
import getCurrentUserFromCookie from "@/middlewares/getCurrentUser";
import type { ScreenSizeType } from "@/providers/screen-size-provider";
import type { Session } from "@/types/auth";
import { handleAction } from "./response-handler";

function getScreen(pageContext: PageContextServer): ScreenSizeType {
  const ua = pageContext.headers ? (pageContext.headers["user-agent"] ?? "") : "";
  const parser = new UAParser(ua);
  const device = parser.getDevice().type;
  if (device && ["mobile", "wearable", "embedded"].includes(device)) {
    return "sm";
  } else if (device === "tablet") {
    return "md";
  } else {
    return "lg";
  }
}

async function getAuthenticatedSession(cookieHeader: string | undefined): Promise<Session | null> {
  if (!cookieHeader) return null;
  const user = await getCurrentUserFromCookie(cookieHeader);
  if (!user) return null;
  const controller = new SessionController({ client: prismaClient });
  const response = await controller.getSession(user.id);
  if (response.success) {
    return response.data;
  } else {
    return null;
  }
}

async function getUserPlaylists(userId: number | null) {
  return handleAction("Get user playlist", async () => {
    const controller = await new SessionController({ client: prismaClient });
    return handleAction("Profile Picture Change", () => controller.getUserPlaylists(userId));
  });
}

export async function getGlobalData(pageContext: PageContextServer) {
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const preferredLanguage = getPreferredLanguage(pageContext.headers["accept-language"]);
  const userPlaylists = await getUserPlaylists(session?.id ?? null);
  const screen = getScreen(pageContext);
  return { session, preferredLanguage, screen, userPlaylists };
}
