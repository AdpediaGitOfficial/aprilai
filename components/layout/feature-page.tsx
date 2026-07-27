import Link from "next/link";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";

/**
 * Consistent scrollable page frame for non-chat feature surfaces. Renders a
 * header (icon + title + description) and a content region over the signature
 * grid backdrop.
 */
export function FeaturePage({
  icon: Icon,
  title,
  description,
  eyebrow,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative flex-1 overflow-y-auto scrollbar-thin">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-10 sm:px-10">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
            <Icon className="size-6" />
          </div>
          <div className="min-w-0">
            {eyebrow && (
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                {eyebrow}
              </span>
            )}
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

/**
 * Placeholder body for features scheduled in a later phase. Communicates intent
 * and offers a way into the working chat rather than dead-ending the user.
 */
export function ComingSoon({
  bullets,
  ctaHref = "/",
  ctaLabel = "Ask April in chat",
}: {
  bullets: string[];
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-xl sm:p-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
        <Sparkles className="size-3 text-primary" /> In development
      </div>
      <p className="mt-4 text-sm text-muted-foreground">This surface will include:</p>
      <ul className="mt-3 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        {ctaLabel} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
