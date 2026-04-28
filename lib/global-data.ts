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
  if (device && ["mobile", "wearable", "embedded"].includes(device)) return "sm";
  if (device === "tablet") return "md";
  return "lg";
}

export async function getAuthenticatedSession(
  cookieHeader: string | undefined
): Promise<Session | null> {
  if (!cookieHeader) return null;
  const user = await getCurrentUserFromCookie(cookieHeader);
  if (!user) return null;

  const controller = new SessionController({ client: prismaClient, user });
  const response = await controller.getSession();
  return response.success ? response.data : null;
}

export async function getGlobalData(pageContext: PageContextServer) {
  const user = await getCurrentUserFromCookie(pageContext.headers.cookie);
  const session = await getAuthenticatedSession(pageContext.headers.cookie);
  const preferredLanguage = getPreferredLanguage(pageContext.headers["accept-language"]);
  const screen = getScreen(pageContext);
  const sessionController = new SessionController({ client: prismaClient, user });
  const userPlaylists = user
    ? await handleAction("Get user playlists (Global)", () => sessionController.getUserPlaylists())
    : { success: true, data: [], status: 200 };

  return { session, preferredLanguage, screen, userPlaylists };
}
