import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/user";
import { listConversations } from "@/lib/db/conversations";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const conversations = await listConversations(user.id);

  return (
    <AppShell user={user} conversations={conversations}>
      {children}
    </AppShell>
  );
}
