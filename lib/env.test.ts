import { describe, expect, it } from "vitest";
import { env } from "./env";

describe("Environnement variabels", () => {
  it("Expect environnement variables to be defined at startup", () => {
    const {
      APP_PORT,
      DATABASE_URL,
      POSTGRES_DB,
      POSTGRES_PASSWORD,
      POSTGRES_USER,
      TOKEN_SECRET,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_PATH,
      APP_BASE_URL,
      CLOUD_API_KEY,
      CLOUD_API_SECRET,
      CLOUD_IMAGE_FOLDER_NAME,
      CLOUD_NAME,
    } = env;

    expect(APP_PORT).toBeDefined();
    expect(DATABASE_URL).toBeDefined();
    expect(POSTGRES_DB).toBeDefined();
    expect(POSTGRES_PASSWORD).toBeDefined();
    expect(POSTGRES_USER).toBeDefined();
    expect(TOKEN_SECRET).toBeDefined();
    expect(GOOGLE_CLIENT_ID).toBeDefined();
    expect(GOOGLE_CLIENT_SECRET).toBeDefined();
    expect(GOOGLE_REDIRECT_PATH).toBeDefined();
    expect(APP_BASE_URL).toBeDefined();
    expect(CLOUD_API_SECRET).toBeDefined();
    expect(CLOUD_API_KEY).toBeDefined();
    expect(CLOUD_IMAGE_FOLDER_NAME).toBeDefined();
    expect(CLOUD_NAME).toBeDefined();
  });
});
