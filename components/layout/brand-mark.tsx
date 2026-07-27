import { BRAND } from "@/lib/brand";

/**
 * Small square avatar used in chat bubbles and the thinking row — the April
 * logo mark. The mark is a self-contained colored icon, so it sits on a soft
 * neutral tile rather than the brand gradient.
 */
export function BrandAvatar({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "grid place-items-center overflow-hidden rounded-lg border border-border bg-surface shadow-sm " +
        className
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BRAND.icon} alt={BRAND.shortName} className="size-[78%] object-contain" />
    </div>
  );
}
