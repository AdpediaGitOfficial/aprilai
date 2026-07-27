import { Scale } from "lucide-react";

/**
 * April's brand mark: a gradient tile with a scales glyph. Reads crisply on
 * both the light paper and dark grounds (unlike the wide wordmark image, which
 * is optimized for dark only). Swap in a light-optimized logo here later.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute -inset-1.5 rounded-2xl blur-lg opacity-45"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="relative grid h-full w-full place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
        <Scale style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.9} />
      </div>
    </div>
  );
}

/** Small square avatar used in chat bubbles and the thinking row. */
export function BrandAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "grid place-items-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow " +
        className
      }
    >
      <Scale className="size-[55%]" strokeWidth={1.9} />
    </div>
  );
}
