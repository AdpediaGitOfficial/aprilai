import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

let cached: Database | null | undefined;

/**
 * Returns the Drizzle client, or `null` when `DATABASE_URL` is not set.
 * Callers (the repository layer) treat `null` as "persistence disabled" and
 * fall back to in-memory behavior, so the app runs with zero config.
 */
export function getDb(): Database | null {
  if (cached !== undefined) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    cached = null;
    return cached;
  }

  // `prepare: false` is friendly to transaction-pooling proxies (Supabase,
  // PgBouncer). Single shared connection is reused across the server runtime.
  const client = postgres(url, { prepare: false });
  cached = drizzle(client, { schema });
  return cached;
}

export { schema };
