"use client";

import { useRouter } from "next/navigation";
import { Plus, FilePlus2, Briefcase, ArrowRight, MessageSquare } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { primaryNav } from "./nav";
import { emitNewChat } from "@/lib/events";

const recentChats = [
  "NDA review · Project Titan",
  "Employment offer — remote",
  "IP assignment — Q3",
  "Delaware filing checklist",
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const newChat = () => {
    onOpenChange(false);
    router.push("/");
    emitNewChat();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search chats, documents, contracts, lawyers, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={newChat}>
            <Plus className="size-4" />
            <span>Start a new chat</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/documents")}>
            <FilePlus2 className="size-4" />
            <span>Upload document</span>
          </CommandItem>
          <CommandItem onSelect={() => go("/marketplace")}>
            <Briefcase className="size-4" />
            <span>Browse marketplace</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          {primaryNav.map((n) => (
            <CommandItem key={n.href} onSelect={() => go(n.href)}>
              <n.icon className="size-4" />
              <span>{n.label}</span>
              <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent chats">
          {recentChats.map((c) => (
            <CommandItem key={c} onSelect={newChat}>
              <MessageSquare className="size-4" />
              <span className="truncate">{c}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
