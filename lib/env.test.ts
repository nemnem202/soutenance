import { describe, expect, it } from "vitest";
import { env } from "./env";

describe("Environment Configuration", () => {
  it("should have all required variables defined and non-empty", () => {
    const keys = Object.keys(env) as (keyof typeof env)[];

    for (const key of keys) {
      const value = env[key];

      expect(value, `Environment variable "${key}" is missing`).toBeDefined();
      expect(value, `Environment variable "${key}" should not be null`).not.toBeNull();

      if (typeof value === "string") {
        expect(value.trim(), `Environment variable "${key}" is an empty string`).not.toBe("");
      }
    }
  });

  it("should have a valid APP_PORT as number", () => {
    expect(typeof env.APP_PORT).toBe("number");
    expect(env.APP_PORT).toBeGreaterThan(0);
  });
});
