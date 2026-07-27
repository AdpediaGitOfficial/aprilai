import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";

export const metadata: Metadata = { title: "Businesses · April AI" };

export default function BusinessesPage() {
  return (
    <FeaturePage
      icon={Building2}
      eyebrow="Organization"
      title="Add Businesses"
      description="Register the legal entities you manage so April can tailor advice, contracts, and reports to each business's jurisdiction and structure."
    >
      <ComingSoon
        bullets={[
          "Create and manage multiple business entities",
          "Per-entity jurisdiction, industry, and compliance profile",
          "Scope conversations and documents to a business",
          "Team access controls per entity",
        ]}
      />
    </FeaturePage>
  );
}
