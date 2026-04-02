import { OAuth2Client } from "google-auth-library";
import { env } from "./env";

const googleClient = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.APP_BASE_URL + env.GOOGLE_REDIRECT_PATH,
});

export default googleClient;
