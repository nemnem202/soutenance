import { describe, expect, it } from "vitest";
import EnvironnementProvider from "./environnement-provider";

describe("Environnement variabels", () => {
  it("Get all environnement variables", () => {
    const {
      APP_PORT,
      DATABASE_URL,
      POSTGRES_DB,
      POSTGRES_PASSWORD,
      POSTGRES_USER,
    } = EnvironnementProvider.get();

    expect(APP_PORT).toBeDefined();
    expect(DATABASE_URL).toBeDefined();
    expect(POSTGRES_DB).toBeDefined();
    expect(POSTGRES_PASSWORD).toBeDefined();
    expect(POSTGRES_USER).toBeDefined();
  });
});
