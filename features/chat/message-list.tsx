"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import {
  Scale,
  Share2,
  MoreHorizontal,
  ArrowDown,
  Square,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { BrandAvatar } from "@/components/layout/brand-mark";

export type ChatContext = { label: string; sub: string };

export function MessageList({
  messages,
  isLoading,
  status,
  onStop,
  onRegenerate,
  context,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  status: string;
  onStop: () => void;
  onRegenerate: () => void;
  context: ChatContext;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const turnCount = messages.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (atBottom) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status, atBottom]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distanceFromBottom < 80);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />

      <div className="relative z-10 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong/60 bg-surface/70 px-2.5 py-1 text-[11px] font-medium text-foreground">
              <Scale className="size-3 text-primary" /> {context.label}
            </span>
            <span className="hidden text-[11px] text-muted-foreground sm:inline">·</span>
            <span className="hidden truncate text-[11px] text-muted-foreground sm:inline">
              {context.sub}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
              {turnCount} turns
            </span>
            <button
              aria-label="Share"
              className="grid size-7 place-items-center rounded-md border border-border/60 bg-surface/40 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <Share2 className="size-3.5" />
            </button>
            <button
              aria-label="More"
              className="grid size-7 place-items-center rounded-md border border-border/60 bg-surface/40 text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex h-[calc(100%-49px)] max-w-4xl">
        <div ref={scrollRef} onScroll={onScroll} className="relative flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 sm:px-10">
            <div className="flex items-center gap-3 py-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/70" />
              <span className="rounded-full border border-border/60 bg-surface/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Today
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/70" />
            </div>

            <div className="flex flex-col gap-1">
              {messages.map((m, i) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isLast={i === messages.length - 1}
                  isLoading={isLoading}
                  onStop={onStop}
                  onRegenerate={onRegenerate}
                />
              ))}
              {status === "submitted" && (
                <div className="py-5">
                  <ThinkingRow />
                </div>
              )}
              <div className="h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[49px] h-6 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent" />

      {!atBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-elevated backdrop-blur hover:border-primary/50 transition-all"
        >
          <ArrowDown className="size-3.5" /> Jump to latest
        </button>
      )}
    </div>
  );
}

function messageText(message: UIMessage): string {
  return message.parts
    .map((p) => (p.type === "text" ? (p.text ?? "") : ""))
    .join("");
}

function MessageBubble({
  message,
  isLast,
  isLoading,
  onStop,
  onRegenerate,
}: {
  message: UIMessage;
  isLast: boolean;
  isLoading: boolean;
  onStop: () => void;
  onRegenerate: () => void;
}) {
  const isUser = message.role === "user";
  const text = messageText(message);
  const [copied, setCopied] = useState(false);
  const time = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [message.id],
  );

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  if (isUser) {
    return (
      <div className="group/turn flex justify-end gap-3 py-4">
        <div className="flex max-w-[85%] flex-col items-end sm:max-w-[75%]">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover/turn:opacity-100">
              {time}
            </span>
            <span className="text-[11px] font-medium text-foreground">You</span>
          </div>
          <div className="relative overflow-hidden rounded-2xl rounded-tr-md border border-border-strong/70 bg-surface/80 px-4 py-2.5 text-[14px] leading-relaxed text-foreground shadow-elevated">
            <span aria-hidden className="absolute inset-y-0 right-0 w-[3px] bg-gradient-brand" />
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        </div>
        <div className="mt-6 grid size-8 shrink-0 place-items-center rounded-lg border border-border-strong bg-surface text-[11px] font-semibold text-foreground">
          You
        </div>
      </div>
    );
  }

  return (
    <div className="group/turn flex gap-3 py-4">
      <BrandAvatar className="mt-0.5 size-8 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="font-display text-sm font-semibold tracking-tight">April</span>
          <span className="rounded-md border border-border/60 bg-surface/50 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
            Legal counsel
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity group-hover/turn:opacity-100">
            {time}
          </span>
        </div>
        <div className="prose prose-invert prose-sm max-w-[65ch] prose-p:leading-relaxed prose-headings:font-display prose-a:text-primary prose-code:text-primary prose-pre:bg-surface prose-pre:border prose-pre:border-border">
          <ReactMarkdown>{text || "​"}</ReactMarkdown>
        </div>
        {isLast && isLoading ? (
          <button
            onClick={onStop}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors"
          >
            <Square className="size-3 fill-current" /> Stop generating
          </button>
        ) : text ? (
          <div className="mt-3 flex items-center gap-0.5 text-muted-foreground">
            <MsgAction onClick={copy} label={copied ? "Copied" : "Copy"}>
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </MsgAction>
            {isLast && (
              <MsgAction onClick={onRegenerate} label="Regenerate">
                <RefreshCw className="size-3.5" />
              </MsgAction>
            )}
            <div className="mx-1 h-4 w-px bg-border/60" />
            <MsgAction onClick={() => {}} label="Good response">
              <ThumbsUp className="size-3.5" />
            </MsgAction>
            <MsgAction onClick={() => {}} label="Bad response">
              <ThumbsDown className="size-3.5" />
            </MsgAction>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MsgAction({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}

function ThinkingRow() {
  return (
    <div className="flex gap-3">
      <BrandAvatar className="mt-0.5 size-8 shrink-0" />
      <div className="flex items-center gap-2 pt-1.5">
        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-primary" />
        <span className="ml-1 text-xs text-muted-foreground">April is thinking…</span>
      </div>
    </div>
  );
}
