import { Scale } from "lucide-react";

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
