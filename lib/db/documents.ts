import "server-only";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { getDb } from "./index";
import { documents, documentChunks, users } from "./schema";
import type { DocumentSummary } from "@/lib/types";

export type { DocumentSummary };

export type RetrievedChunk = {
  documentId: string;
  title: string;
  content: string;
  similarity: number;
};

/** Documents owned by a user, newest first. Empty when DB is disabled. */
export async function listDocuments(userId: string): Promise<DocumentSummary[]> {
  const db = getDb();
  if (!db) return [];
  return db
    .select({
      id: documents.id,
      title: documents.title,
      contentType: documents.contentType,
      chunkCount: documents.chunkCount,
      status: documents.status,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt));
}

/** Persists a document and its embedded chunks in a single transaction. */
export async function createDocumentWithChunks(params: {
  userId: string;
  title: string;
  contentType: string;
  byteSize: number;
  chunks: { index: number; content: string; embedding: number[] }[];
}): Promise<DocumentSummary> {
  const db = getDb();
  if (!db) throw new Error("Database not configured.");

  const { userId, title, contentType, byteSize, chunks } = params;

  // Guarantee the owner row exists (guest mode) for the FK.
  await db.insert(users).values({ id: userId }).onConflictDoNothing();

  return db.transaction(async (tx) => {
    const [doc] = await tx
      .insert(documents)
      .values({
        userId,
        title,
        contentType,
        byteSize,
        chunkCount: chunks.length,
        status: "ready",
      })
      .returning();

    if (chunks.length > 0) {
      await tx.insert(documentChunks).values(
        chunks.map((c) => ({
          documentId: doc.id,
          userId,
          chunkIndex: c.index,
          content: c.content,
          embedding: c.embedding,
        })),
      );
    }

    return {
      id: doc.id,
      title: doc.title,
      contentType: doc.contentType,
      chunkCount: doc.chunkCount,
      status: doc.status,
      createdAt: doc.createdAt,
    };
  });
}

export async function deleteDocument(userId: string, documentId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db
    .delete(documents)
    .where(and(eq(documents.id, documentId), eq(documents.userId, userId)));
}

/** Vector similarity search over a user's chunks (cosine). */
export async function searchChunks(
  userId: string,
  embedding: number[],
  limit = 6,
): Promise<RetrievedChunk[]> {
  const db = getDb();
  if (!db) return [];

  const similarity = sql<number>`1 - (${cosineDistance(documentChunks.embedding, embedding)})`;

  return db
    .select({
      documentId: documentChunks.documentId,
      title: documents.title,
      content: documentChunks.content,
      similarity,
    })
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(and(eq(documentChunks.userId, userId), gt(similarity, 0.15)))
    .orderBy(desc(similarity))
    .limit(limit);
}
