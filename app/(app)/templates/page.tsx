import type { Metadata } from "next";
import { LayoutTemplate } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";

export const metadata: Metadata = { title: "Templates · April AI" };

export default function TemplatesPage() {
  return (
    <FeaturePage
      icon={LayoutTemplate}
      eyebrow="Library"
      title="Templates"
      description="A curated library of contract and document templates you can generate, customize with April, and reuse across matters."
    >
      <ComingSoon
        bullets={[
          "Starter templates: NDA, employment, rental, IP assignment, and more",
          "One-click generation into a drafting session",
          "Save your own templates and clause snippets",
          "Jurisdiction-aware variants",
        ]}
        ctaHref="/contracts/draft"
        ctaLabel="Start drafting"
      />
    </FeaturePage>
  );
}
