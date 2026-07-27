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

// Embeddings power RAG. OpenAI is the embedding provider regardless of the chat
// provider (Anthropic offers no embeddings API).
export const embeddingsEnabled = Boolean(process.env.OPENAI_API_KEY);

// Retrieval-augmented document analysis needs both a vector store (Postgres +
// pgvector) and an embedding model.
export const ragEnabled = dbEnabled && embeddingsEnabled;

// Real web search via Tavily. Optional; the chat gains a web-search tool when set.
export const webSearchEnabled = Boolean(process.env.TAVILY_API_KEY);
