"use client";

import { useEffect, useRef } from "react";
import {
  Paperclip,
  Globe,
  Mic,
  ArrowUp,
  Square,
  Command as CommandIcon,
} from "lucide-react";

export function Composer({
  input,
  setInput,
  webSearch,
  setWebSearch,
  onSubmit,
  isLoading,
  onStop,
}: {
  input: string;
  setInput: (v: string) => void;
  webSearch: boolean;
  setWebSearch: (v: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onStop: () => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    taRef.current?.focus();
  }, [isLoading]);

  return (
    <div className="w-full">
      <div className="group relative rounded-2xl border border-border-strong bg-surface/80 p-3 shadow-elevated backdrop-blur-xl transition-all focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/15">
        <div className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-brand opacity-70" />

        <textarea
          ref={taRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={2}
          placeholder="Ask anything — draft a clause, review a contract, cite case law…"
          className="w-full resize-none bg-transparent px-2 pt-1 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <IconBtn label="Attach">
              <Paperclip className="size-4" />
            </IconBtn>

            <button
              onClick={() => setWebSearch(!webSearch)}
              className={
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all " +
                (webSearch
                  ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground")
              }
            >
              <Globe className="size-3.5" /> Web search
            </button>

            <IconBtn label="More">
              <MoreDots />
            </IconBtn>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
              <CommandIcon className="size-3" />Y
            </kbd>
            <button className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Mic className="size-4" />
            </button>
            {isLoading ? (
              <button
                onClick={onStop}
                className="grid size-9 place-items-center rounded-full bg-secondary text-foreground hover:bg-muted transition-colors"
                aria-label="Stop"
              >
                <Square className="size-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!input.trim()}
                className="grid size-9 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                aria-label="Send"
              >
                <ArrowUp className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}

function MoreDots() {
  return (
    <div className="flex gap-0.5">
      <span className="size-1 rounded-full bg-current" />
      <span className="size-1 rounded-full bg-current" />
      <span className="size-1 rounded-full bg-current" />
    </div>
  );
}
