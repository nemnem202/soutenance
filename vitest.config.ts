import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globalSetup: "./vitest.global-setup.ts",
    root: ".",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
