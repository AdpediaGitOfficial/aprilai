import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { authEnabled } from "@/lib/config";

/**
 * Wraps the tree in Clerk's provider only when auth is configured. Without keys
 * the provider is skipped entirely, so the app renders in guest mode.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  if (!authEnabled) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#825dff",
          colorBackground: "#0c0e14",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
