import "server-only";
import { extractText } from "./extract";
import { chunkText } from "./chunk";
import { embedTexts } from "@/lib/ai/embeddings";
import { createDocumentWithChunks } from "@/lib/db/documents";
import type { DocumentSummary } from "@/lib/types";

/**
 * End-to-end ingestion: extract text → chunk → embed → persist.
 * Used by the documents API. Assumes RAG is enabled (DB + embeddings).
 */
export async function ingestDocument(params: {
  userId: string;
  filename: string;
  contentType: string;
  bytes: Uint8Array;
}): Promise<DocumentSummary> {
  const { userId, filename, contentType, bytes } = params;

  const text = await extractText({ filename, contentType, bytes });
  if (!text) {
    throw new Error("No readable text was found in this file.");
  }

  const chunks = chunkText(text);
  const embeddings = await embedTexts(chunks.map((c) => c.content));

  const embedded = chunks.map((c, i) => ({
    index: c.index,
    content: c.content,
    embedding: embeddings[i],
  }));

  return createDocumentWithChunks({
    userId,
    title: filename,
    contentType: contentType || "text/plain",
    byteSize: bytes.byteLength,
    chunks: embedded,
  });
}

/** Ingest raw pasted text (no file). */
export async function ingestText(params: {
  userId: string;
  title: string;
  text: string;
}): Promise<DocumentSummary> {
  const { userId, title, text } = params;
  const bytes = new TextEncoder().encode(text);
  return ingestDocument({
    userId,
    filename: title || "Pasted text",
    contentType: "text/plain",
    bytes,
  });
}
