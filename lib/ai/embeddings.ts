import "server-only";
import { embed, embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { EMBEDDING_DIMENSIONS } from "@/lib/db/schema";

/**
 * Embedding provider. OpenAI backs RAG regardless of the chat provider, since
 * Anthropic has no embeddings API. Gated by `OPENAI_API_KEY`.
 */
const MODEL_ID = "text-embedding-3-small";

export { EMBEDDING_DIMENSIONS };

function embeddingModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY — required for embeddings/RAG.");
  return createOpenAI({ apiKey }).textEmbeddingModel(MODEL_ID);
}

/** Embed many documents/chunks in one batched request. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const { embeddings } = await embedMany({ model: embeddingModel(), values: texts });
  return embeddings;
}

/** Embed a single query string. */
export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({ model: embeddingModel(), value: text });
  return embedding;
}
