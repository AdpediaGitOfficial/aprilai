import Image from "next/image";
import { BRAND } from "@/lib/brand";

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute -inset-2 rounded-2xl blur-xl opacity-60"
        style={{ background: "var(--gradient-brand)" }}
      />
      <Image
        src={BRAND.logo}
        alt={`${BRAND.name} logo`}
        width={size}
        height={size}
        className="relative h-full w-full rounded-md object-contain drop-shadow-[0_2px_10px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
        priority
      />
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
      <Image
        src={BRAND.logo}
        alt={BRAND.shortName}
        width={20}
        height={20}
        className="size-5 rounded-sm object-contain"
      />
    </div>
  );
}
