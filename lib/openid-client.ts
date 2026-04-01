import { discovery } from "openid-client";
import { env } from "./env";

const googleIssuerUrl = "https://accounts.google.com";

export const getGoogleClient = async () => {
  const config = await discovery(
    new URL(googleIssuerUrl),
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
  );
  return config;
};
