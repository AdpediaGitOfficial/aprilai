import "server-only";
import type { ToolSet } from "ai";
import { ragEnabled, webSearchEnabled } from "@/lib/config";
import { webSearchTool } from "./web-search";
import { createSearchDocumentsTool } from "./search-documents";

/**
 * Assembles the tool set for a chat request based on what's configured and what
 * the user enabled. Returns `undefined` when no tools apply, so plain chat
 * behaves exactly as before.
 */
export function buildTools(opts: { userId: string; webSearch: boolean }): ToolSet | undefined {
  const tools: ToolSet = {};

  if (opts.webSearch && webSearchEnabled) {
    tools.webSearch = webSearchTool;
  }

  if (ragEnabled) {
    tools.searchDocuments = createSearchDocumentsTool(opts.userId);
  }

  return Object.keys(tools).length > 0 ? tools : undefined;
}
