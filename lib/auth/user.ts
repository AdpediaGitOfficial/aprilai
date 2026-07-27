import "server-only";
import { authEnabled, dbEnabled } from "@/lib/config";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { AppUser } from "@/lib/types";

export type { AppUser };

/** Identity used when auth is not configured (keeps the UI's placeholder look). */
const GUEST: AppUser = {
  id: "guest",
  name: "Domain Jango",
  email: null,
  imageUrl: null,
  plan: "Free plan",
  credits: 3,
  isGuest: true,
};

function planLabel(plan: string): string {
  return plan === "free" ? "Free plan" : plan;
}

/**
 * Resolves the current user for the request. Returns a guest when auth is
 * disabled or no session is present. When both auth and a database are
 * configured, upserts the user row so persistence has a stable owner.
 */
export async function getCurrentUser(): Promise<AppUser> {
  if (!authEnabled) return GUEST;

  const { currentUser } = await import("@clerk/nextjs/server");
  const clerk = await currentUser();
  if (!clerk) return GUEST;

  const name = clerk.fullName || clerk.firstName || clerk.username || "You";
  const email = clerk.primaryEmailAddress?.emailAddress ?? null;
  const imageUrl = clerk.imageUrl ?? null;

  const db = dbEnabled ? getDb() : null;
  if (db) {
    const rows = await db
      .insert(users)
      .values({ id: clerk.id, name, email, imageUrl })
      .onConflictDoUpdate({
        target: users.id,
        set: { name, email, imageUrl, updatedAt: new Date() },
      })
      .returning();
    const row = rows[0];
    if (row) {
      return {
        id: row.id,
        name: row.name ?? name,
        email: row.email,
        imageUrl: row.imageUrl,
        plan: planLabel(row.plan),
        credits: row.credits,
        isGuest: false,
      };
    }
  }

  return { id: clerk.id, name, email, imageUrl, plan: "Free plan", credits: 3, isGuest: false };
}
