import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";

export const metadata: Metadata = { title: "Marketplace · April AI" };

export default function MarketplacePage() {
  return (
    <FeaturePage
      icon={Briefcase}
      eyebrow="Network"
      title="Marketplace"
      description="Connect with verified lawyers and legal service providers when a matter needs a human expert to review or take over."
    >
      <ComingSoon
        bullets={[
          "Browse verified counsel by practice area and jurisdiction",
          "Hand off an April conversation to a human lawyer with full context",
          "Ratings, availability, and transparent pricing",
          "Secure messaging and engagement tracking",
        ]}
      />
    </FeaturePage>
  );
}
