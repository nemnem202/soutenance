import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth-utils";
import { env } from "@/lib/env";

export default async function getCurrentUserFromCookie(
  cookieString: string | undefined
): Promise<{ id: number } | null> {
  if (!cookieString) return null;

  const cookies = Object.fromEntries(cookieString.split(";").map((c) => c.trim().split("=")));

  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.id ? { id: Number(payload.id) } : null;
  } catch {
    return null;
  }
}
