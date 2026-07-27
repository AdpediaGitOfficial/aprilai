import "server-only";
import { and, desc, eq } from "drizzle-orm";
import type { UIMessage } from "ai";
import { getDb } from "./index";
import { conversations, messages, users } from "./schema";
import type { ConversationSummary } from "@/lib/types";

export type { ConversationSummary };

function firstUserText(list: UIMessage[]): string {
  const firstUser = list.find((m) => m.role === "user");
  const text = firstUser?.parts
    ?.map((p) => (p.type === "text" ? (p.text ?? "") : ""))
    .join("")
    .trim();
  if (!text) return "New conversation";
  return text.length > 60 ? text.slice(0, 57) + "…" : text;
}

/** Recent conversations for a user, newest first. Empty when DB is disabled. */
export async function listConversations(
  userId: string,
  limit = 12,
): Promise<ConversationSummary[]> {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      updatedAt: conversations.updatedAt,
    })
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt))
    .limit(limit);
  return rows;
}

/** Full transcript for a conversation the user owns, shaped for `useChat`. */
export async function getConversationMessages(
  userId: string,
  conversationId: string,
): Promise<UIMessage[]> {
  const db = getDb();
  if (!db) return [];

  const owner = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)))
    .limit(1);
  if (owner.length === 0) return [];

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);

  return rows.map((r) => ({
    id: r.id,
    role: r.role as UIMessage["role"],
    parts: r.parts,
  }));
}

/**
 * Persists a conversation and its messages. Idempotent: the conversation is
 * upserted and messages are inserted by stable id (existing ones are skipped),
 * so it is safe to call on every stream completion. No-op without a database.
 */
export async function saveConversation(params: {
  userId: string;
  conversationId: string;
  promptKey: string;
  messages: UIMessage[];
}): Promise<void> {
  const db = getDb();
  if (!db) return;

  const { userId, conversationId, promptKey, messages: list } = params;
  if (list.length === 0) return;

  const now = new Date();

  // Guarantee the owner row exists (guest mode, or a race before the user
  // upsert in getCurrentUser) so the conversation FK is always satisfiable.
  await db.insert(users).values({ id: userId }).onConflictDoNothing();
  await db
    .insert(conversations)
    .values({
      id: conversationId,
      userId,
      title: firstUserText(list),
      promptKey,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: conversations.id,
      set: { updatedAt: now },
    });

  const rows = list.map((m) => ({
    id: m.id,
    conversationId,
    role: m.role,
    parts: m.parts,
  }));

  await db.insert(messages).values(rows).onConflictDoNothing({ target: messages.id });
}
