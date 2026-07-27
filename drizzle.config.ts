import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Only needed for db:push / db:migrate / db:studio. `db:generate` (writing
    // SQL from the schema) works without a live connection.
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
