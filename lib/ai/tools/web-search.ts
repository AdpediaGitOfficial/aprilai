import "server-only";
import { tool } from "ai";
import { z } from "zod";

type TavilyResult = { title: string; url: string; content: string };

/**
 * Real web search via Tavily. Returns a short synthesized answer plus sources
 * the model can cite. Registered only when `TAVILY_API_KEY` is set.
 */
export const webSearchTool = tool({
  description:
    "Search the public web for current information, recent news, and up-to-date legal developments. Use when the user asks about recent events or you need facts newer than your training data. Always cite the source URLs.",
  inputSchema: z.object({
    query: z.string().describe("A focused web search query."),
  }),
  execute: async ({ query }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) return { error: "Web search is not configured." };

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          max_results: 5,
          search_depth: "basic",
          include_answer: true,
        }),
      });
      if (!res.ok) return { error: `Web search failed (${res.status}).` };

      const data = (await res.json()) as { answer?: string; results?: TavilyResult[] };
      return {
        answer: data.answer ?? null,
        results: (data.results ?? []).map((r) => ({
          title: r.title,
          url: r.url,
          snippet: r.content,
        })),
      };
    } catch (err) {
      console.error("[webSearchTool]", err);
      return { error: "Web search request errored." };
    }
  },
});
