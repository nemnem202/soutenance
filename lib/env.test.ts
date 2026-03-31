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
    } = env;

    expect(APP_PORT).toBeDefined();
    expect(DATABASE_URL).toBeDefined();
    expect(POSTGRES_DB).toBeDefined();
    expect(POSTGRES_PASSWORD).toBeDefined();
    expect(POSTGRES_USER).toBeDefined();
  });
});
