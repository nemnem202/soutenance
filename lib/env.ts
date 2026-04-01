import { logger } from "./logger";

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DATABASE_URL,
  APP_PORT,
  TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  APP_BASE_URL,
} = process.env;

if (
  !POSTGRES_USER ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_DB ||
  !DATABASE_URL ||
  !APP_PORT ||
  !TOKEN_SECRET ||
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GOOGLE_REDIRECT_URI ||
  !APP_BASE_URL
) {
  if (!POSTGRES_USER)
    logger.error("Missing environment variable: POSTGRES_USER");
  if (!POSTGRES_PASSWORD)
    logger.error("Missing environment variable: POSTGRES_PASSWORD");
  if (!POSTGRES_DB) logger.error("Missing environment variable: POSTGRES_DB");
  if (!DATABASE_URL) logger.error("Missing environment variable: DATABASE_URL");
  if (!APP_PORT) logger.error("Missing environment variable: APP_PORT");
  if (!TOKEN_SECRET) logger.error("Missing environment variable: TOKEN_SECRET");
  if (!GOOGLE_CLIENT_ID)
    logger.error("Missing environment variable: GOOGLE_CLIENT_ID");
  if (!GOOGLE_CLIENT_SECRET)
    logger.error("Missing environment variable: GOOGLE_CLIENT_ID");
  if (!GOOGLE_REDIRECT_URI)
    logger.error("Missing environment variable: GOOGLE_REDIRECT_URI");
  if (!APP_BASE_URL) logger.error("Missing environment variable: APP_BASE_URL");
  process.exit(1);
} else {
  logger.success("All environement variables are set");
}

export const env = {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DATABASE_URL,
  APP_PORT: parseInt(APP_PORT, 10),
  TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  APP_BASE_URL,
};
