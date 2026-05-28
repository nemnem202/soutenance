import { SignJWT } from "jose";
import { env } from "./env";
import { CookieOptions } from "express";

export const COOKIE_NAME = "token";

export const getCookieOptions = (remember: boolean): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "prod",
  path: "/",
  maxAge: remember ? 365 * 24 * 3600 : 3600,
  sameSite: process.env.NODE_ENV === "prod" ? "strict" : "lax",
});

export async function generateJwt(userId: number, remember: boolean): Promise<string> {
  const secret = new TextEncoder().encode(env.TOKEN_SECRET);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(remember ? "3w" : "1h")
    .sign(secret);
}
