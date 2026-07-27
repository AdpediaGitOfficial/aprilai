"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Search, Sparkles, ChevronDown, Command as CommandIcon, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { primaryNav, type NavItem } from "./nav";
import { BRAND } from "@/lib/brand";
import { emitNewChat } from "@/lib/events";
import { authEnabled } from "@/lib/config";
import type { AppUser, ConversationSummary } from "@/lib/types";

const SAMPLE_CHATS = [
  "NDA review · Project Titan",
  "Employment offer — remote",
  "IP assignment — Q3",
  "Delaware filing checklist",
];

export function Sidebar({
  onOpenPalette,
  user,
  conversations,
}: {
  onOpenPalette: () => void;
  user: AppUser;
  conversations: ConversationSummary[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const startNewChat = () => {
    if (pathname !== "/") router.push("/");
    emitNewChat();
  };

  return (
    <aside className="relative hidden w-72 shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center px-5 pt-6 pb-5">
        {/* Light logo (default). eslint-disable-next-line @next/next/no-img-element -- SVG logo, auto width */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND.logo}
          alt={BRAND.name}
          className="h-9 w-auto max-w-[200px] object-contain object-left dark:hidden"
        />
        {/* White logo for dark mode. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND.logoWhite}
          alt={BRAND.name}
          className="hidden h-9 w-auto max-w-[200px] object-contain object-left dark:block"
        />
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
          {conversations.length > 0
            ? conversations.map((c) => (
                <Link
                  key={c.id}
                  href={`/?c=${c.id}`}
                  className="block w-full truncate rounded-md px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {c.title}
                </Link>
              ))
            : SAMPLE_CHATS.map((chat) => (
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
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.name}
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-[11px] font-bold text-primary-foreground">
            {initials || "AA"}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user.plan} · {user.credits} credits
          </p>
        </div>
        {authEnabled && !user.isGuest ? (
          <SignOutButton>
            <button
              aria-label="Sign out"
              className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </SignOutButton>
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
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
