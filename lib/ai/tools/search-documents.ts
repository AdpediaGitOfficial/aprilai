import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { embedQuery } from "@/lib/ai/embeddings";
import { searchChunks } from "@/lib/db/documents";

/**
 * Retrieval tool over the current user's uploaded documents (RAG). Embeds the
 * query and returns the most relevant chunks with their source titles so the
 * model can ground answers and cite documents. Bound to a specific user.
 */
export function createSearchDocumentsTool(userId: string) {
  return tool({
    description:
      "Search the user's own uploaded documents (contracts, filings, notes) for relevant passages. Use this whenever a question might be answered by their documents. Cite the document titles you rely on.",
    inputSchema: z.object({
      query: z.string().describe("What to look for in the user's documents."),
    }),
    execute: async ({ query }) => {
      try {
        const embedding = await embedQuery(query);
        const chunks = await searchChunks(userId, embedding, 6);
        if (chunks.length === 0) {
          return { matches: [], note: "No relevant passages found in the user's documents." };
        }
        return {
          matches: chunks.map((c) => ({
            document: c.title,
            similarity: Number(c.similarity.toFixed(3)),
            excerpt: c.content,
          })),
        };
      } catch (err) {
        console.error("[searchDocumentsTool]", err);
        return { error: "Document search errored." };
      }
    },
  });
}
