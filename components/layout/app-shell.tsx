"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Sidebar, SidebarContent } from "./sidebar";
import { TopBar } from "./top-bar";
import { CommandPalette } from "./command-palette";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { AppUser, ConversationSummary } from "@/lib/types";

/**
 * Authenticated workspace frame: persistent sidebar (desktop) + a slide-out
 * drawer (mobile) + top bar + global command palette. Rendered once by the
 * `(app)` layout so every feature page shares it.
 */
export function AppShell({
  children,
  user,
  conversations,
}: {
  children: ReactNode;
  user: AppUser;
  conversations: ConversationSummary[];
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Global ⌘K / Ctrl+K toggles the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop rail */}
      <Sidebar onOpenPalette={() => setPaletteOpen(true)} user={user} conversations={conversations} />

      {/* Mobile drawer */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 border-border bg-surface p-0 lg:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent
            user={user}
            conversations={conversations}
            onOpenPalette={() => {
              setMobileNavOpen(false);
              setPaletteOpen(true);
            }}
            onNavigate={() => setMobileNavOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <TopBar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        {children}
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
