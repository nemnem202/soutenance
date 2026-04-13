import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
    seed: "pnpm exec tsx seed/seed.ts",
  },
  datasource: {
    url: databaseUrl || "",
  },
});
