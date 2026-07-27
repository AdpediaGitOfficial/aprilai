import {
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
  index,
  vector,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { UIMessage } from "ai";

/** Embedding dimensions for OpenAI text-embedding-3-small. */
export const EMBEDDING_DIMENSIONS = 1536;

/**
 * Users. `id` mirrors the auth provider's user id (e.g. Clerk `user_...`) so we
 * never store a second identity. Credits/plan back the billing surface the UI
 * already advertises.
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  imageUrl: text("image_url"),
  plan: text("plan").notNull().default("free"),
  credits: integer("credits").notNull().default(3),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** A single chat thread, owned by a user and scoped to a product surface. */
export const conversations = pgTable(
  "conversations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull().default("New conversation"),
    promptKey: text("prompt_key").notNull().default("general"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("conversations_user_id_idx").on(t.userId)],
);

/**
 * Messages. `parts` stores the AI SDK `UIMessage.parts` array verbatim (text,
 * tool calls, etc.) so the transcript round-trips losslessly into `useChat`.
 */
export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    parts: jsonb("parts").notNull().$type<UIMessage["parts"]>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_conversation_id_idx").on(t.conversationId)],
);

/** An uploaded source document owned by a user (RAG corpus). */
export const documents = pgTable(
  "documents",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    contentType: text("content_type").notNull().default("text/plain"),
    byteSize: integer("byte_size").notNull().default(0),
    chunkCount: integer("chunk_count").notNull().default(0),
    status: text("status").notNull().default("ready"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("documents_user_id_idx").on(t.userId)],
);

/**
 * A chunk of a document with its embedding. The HNSW cosine index is added in
 * the migration SQL (drizzle does not manage the pgvector extension/index).
 */
export const documentChunks = pgTable(
  "document_chunks",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    documentId: text("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunk_index").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("document_chunks_document_id_idx").on(t.documentId)],
);

export type User = typeof users.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type DocumentChunk = typeof documentChunks.$inferSelect;
