"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Globe, Bell, Command as CommandIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { emitNewChat } from "@/lib/events";

export function TopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLang] = useState("English");
  const languages = ["English", "Español", "Français", "Deutsch", "हिन्दी", "العربية"];

  const startNewChat = () => {
    if (pathname !== "/") router.push("/");
    emitNewChat();
  };

  return (
    <header className="relative z-10 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/40 px-6 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          <span className="truncate text-xs text-muted-foreground">
            <span className="font-medium text-foreground">April Agent</span> · Legal counsel · online
          </span>
        </div>
        <button
          onClick={startNewChat}
          className="hidden items-center gap-1.5 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border-strong transition-all md:inline-flex"
        >
          <Plus className="size-3.5" /> New chat
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={onOpenPalette}
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
            <CommandIcon className="size-3" />K
          </kbd>
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="Language"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Globe className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-1">
            <div className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Language
            </div>
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-secondary"
              >
                <span>{l}</span>
                {l === lang && <span className="size-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="Notifications"
              className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Bell className="size-4" />
              <span className="absolute right-2 top-2 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-primary ring-2 ring-background" />
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="font-display text-sm font-semibold">Notifications</span>
              <button className="text-[11px] text-muted-foreground hover:text-foreground">
                Mark all read
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {[
                { title: "NDA draft ready to review", time: "2m ago" },
                { title: "New reply from Counsel Meera", time: "1h ago" },
                { title: "Contract analysis completed", time: "Yesterday" },
              ].map((n) => (
                <button
                  key={n.title}
                  className="flex w-full items-start gap-3 border-b border-border/60 px-3 py-2.5 text-left hover:bg-secondary/60"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{n.time}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 text-center">
              <button className="text-xs text-primary hover:underline">View all</button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
