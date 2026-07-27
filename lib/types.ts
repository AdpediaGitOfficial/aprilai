/**
 * Client-safe shared types. Kept free of any server-only imports so both
 * server components (layout, route handlers) and client components (sidebar)
 * can depend on them.
 */

export type AppUser = {
  id: string;
  name: string;
  email: string | null;
  imageUrl: string | null;
  plan: string;
  credits: number;
  isGuest: boolean;
};

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: Date;
};
