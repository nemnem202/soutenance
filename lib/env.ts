import { logger } from "./logger";

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  DATABASE_URL,
  APP_PORT,
  TOKEN_SECRET,
} = process.env;

if (
  !POSTGRES_USER ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_DB ||
  !DATABASE_URL ||
  !APP_PORT ||
  !TOKEN_SECRET
) {
  if (!POSTGRES_USER)
    logger.error("Missing environment variable: POSTGRES_USER");
  if (!POSTGRES_PASSWORD)
    logger.error("Missing environment variable: POSTGRES_PASSWORD");
  if (!POSTGRES_DB) logger.error("Missing environment variable: POSTGRES_DB");
  if (!DATABASE_URL) logger.error("Missing environment variable: DATABASE_URL");
  if (!APP_PORT) logger.error("Missing environment variable: APP_PORT");
  if (!TOKEN_SECRET) logger.error("Missin environment variable: TOKEN_SECRET");
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
};
