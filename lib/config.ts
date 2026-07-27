/**
 * Feature flags derived from the environment.
 *
 * Auth and persistence are *progressive*: the app runs fully with no
 * configuration (guest identity, in-memory chat), and lights up automatically
 * when the relevant env vars are present. This keeps local dev and previews
 * zero-config while supporting a real production deployment.
 */

// Clerk publishable key is `NEXT_PUBLIC_*`, so this flag is safe on the client.
export const authEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// DATABASE_URL is server-only; this evaluates to `false` in client bundles,
// which is correct — persistence is only ever read/written on the server.
export const dbEnabled = Boolean(process.env.DATABASE_URL);
