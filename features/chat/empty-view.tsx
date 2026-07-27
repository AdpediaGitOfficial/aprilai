"use client";

import {
  FileText,
  Flame,
  FilePlus2,
  TrendingUp,
  Heart,
  HelpCircle,
  Calculator,
  ShieldCheck,
  Scale,
  type LucideIcon,
} from "lucide-react";

type PromptChip = { icon: LucideIcon; label: string; tint: string };

const prompts: PromptChip[] = [
  { icon: FileText, label: "Draft an NDA contract.", tint: "text-violet-300" },
  { icon: Flame, label: "What are my rights when getting fired?", tint: "text-orange-300" },
  { icon: FilePlus2, label: "Create a rental agreement.", tint: "text-amber-300" },
  { icon: TrendingUp, label: "Steps to start a company.", tint: "text-emerald-300" },
  { icon: Heart, label: "Checklist before marriage.", tint: "text-rose-300" },
  { icon: HelpCircle, label: "How to file a consumer complaint?", tint: "text-cyan-300" },
  { icon: Calculator, label: "Duties of an accountant?", tint: "text-fuchsia-300" },
  { icon: ShieldCheck, label: "How to protect intellectual property?", tint: "text-teal-300" },
];

export function EmptyView({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="relative flex-1 overflow-y-auto scrollbar-thin">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, var(--primary), transparent 70%)",
          opacity: 0.15,
        }}
      />
      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-6 py-16">
        <Hero />
        <div className="flex w-full flex-wrap justify-center gap-2">
          {prompts.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.label}
                onClick={() => onPick(p.label)}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-2 text-sm text-muted-foreground backdrop-blur hover:border-border-strong hover:bg-surface-elevated hover:text-foreground hover:shadow-glow transition-all"
              >
                <Icon className={"size-3.5 " + p.tint} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="mb-10 flex flex-col items-center text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
        <Scale className="size-3 text-primary" />
        Legal intelligence · v2 model
      </div>
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        <span className="text-gradient-brand">Try these prompts</span>
      </h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        Ask April anything about contracts, compliance, or case law. Get precise, cited counsel in
        seconds.
      </p>
    </div>
  );
}
