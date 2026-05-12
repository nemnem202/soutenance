// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globalSetup: "./vitest.global-setup.ts",
    root: ".",
    fileParallelism: false,
    isolate: true,
    coverage: {
      provider: "v8",
      include: ["controllers/**/*.{ts,tsx}"],
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
