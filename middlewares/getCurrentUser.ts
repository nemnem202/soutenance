import { jwtVerify } from "jose";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

function parseCookie(str: string): Record<string, string> {
  if (!str || str === "") return {};
  return Object.fromEntries(
    str.split(";").map((p) => {
      const idx = p.indexOf("=");
      return [
        decodeURIComponent(p.slice(0, idx).trim()),
        decodeURIComponent(p.slice(idx + 1).trim()),
      ];
    })
  );
}

export default async function getCurrentUserFromCookie(
  cookie: string
): Promise<{ id: number } | null> {
  const token = parseCookie(cookie).token;

  let currentUser: { id: number } | null = null;

  logger.info("User token: ", token ? `${token.slice(0, 5)}...` : "absent");

  if (token) {
    try {
      const secret = new TextEncoder().encode(env.TOKEN_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (!payload.id) throw new Error("No username in payload");
      currentUser = { id: Number(payload.id) };
    } catch (err) {
      logger.error("Failed to decode user token", err);
      currentUser = null;
    }
  }

  logger.info("User connected: ", currentUser);

  return currentUser;
}
