"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Search, Settings, Sparkles, ChevronDown, Command as CommandIcon } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { primaryNav, type NavItem } from "./nav";
import { BRAND } from "@/lib/brand";
import { emitNewChat } from "@/lib/events";

export function Sidebar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const startNewChat = () => {
    if (pathname !== "/") router.push("/");
    emitNewChat();
  };

  return (
    <aside className="relative hidden w-72 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <BrandMark />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold tracking-tight text-foreground">
            The {BRAND.name}
          </p>
          <p className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            You <span className="text-primary">^</span> AI
          </p>
        </div>
        <button className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Settings className="size-4" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={startNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm font-medium text-foreground hover:border-primary/50 hover:bg-surface-elevated transition-all"
        >
          <Plus className="size-4 text-primary" /> New chat
        </button>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={onOpenPalette}
          className="group flex w-full items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-left text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
        >
          <Search className="size-4" />
          <span className="flex-1 truncate">Search anything…</span>
          <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:flex">
            <CommandIcon className="size-3" /> K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4">
        <ul className="space-y-0.5">
          {primaryNav.map((item) => (
            <NavRow key={item.href} item={item} active={isActive(pathname, item.href)} />
          ))}
        </ul>

        <Section title="Cases" action />
        <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background/40 py-2 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all">
          <Plus className="size-3.5" /> New case
        </button>

        <Section title="Chats" action />
        <div className="mt-2 space-y-0.5">
          {[
            "NDA review · Project Titan",
            "Employment offer — remote",
            "IP assignment — Q3",
            "Delaware filing checklist",
          ].map((chat) => (
            <button
              key={chat}
              className="w-full truncate rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {chat}
            </button>
          ))}
        </div>
      </nav>

      <div className="px-3 pb-3">
        <button className="group relative w-full overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground bg-gradient-brand shadow-glow transition-transform hover:scale-[1.01] active:scale-[0.99]">
          <span className="relative z-10 inline-flex items-center gap-2">
            <Sparkles className="size-4" /> Activate Pro
          </span>
          <span
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "linear-gradient(120deg, transparent 30%, oklch(1 0 0 / 0.25) 50%, transparent 70%)",
            }}
          />
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-border px-4 py-3">
        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-[11px] font-bold text-primary-foreground">
          DJ
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Domain Jango</p>
          <p className="truncate text-[11px] text-muted-foreground">Free plan · 3 credits</p>
        </div>
        <ChevronDown className="size-4 text-muted-foreground" />
      </div>
    </aside>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavRow({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={
          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
          (active
            ? "bg-secondary text-foreground ring-1 ring-border-strong"
            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
        }
      >
        <Icon
          className={
            "size-4 shrink-0 " +
            (active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")
          }
        />
        <span className="flex-1 truncate text-left font-medium">{item.label}</span>
        {item.badge && (
          <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {item.badge}
          </kbd>
        )}
      </Link>
    </li>
  );
}

function Section({ title, action }: { title: string; action?: boolean }) {
  return (
    <div className="mt-6 mb-1 flex items-center justify-between px-3">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </span>
      {action && (
        <button className="grid size-5 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Plus className="size-3.5" />
        </button>
      )}
    </div>
  );
}
