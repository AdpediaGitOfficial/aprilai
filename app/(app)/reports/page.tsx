import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";

export const metadata: Metadata = { title: "Reports · April AI" };

export default function ReportsPage() {
  return (
    <FeaturePage
      icon={BarChart3}
      eyebrow="Insights"
      title="Reports"
      description="Generate structured reports from your matters, contracts, and conversations — risk summaries, obligation trackers, and compliance overviews."
    >
      <ComingSoon
        bullets={[
          "Auto-generated risk and obligation summaries per matter",
          "Exportable PDF and DOCX reports",
          "Charts and trends across your contract portfolio",
          "Scheduled reports and shareable links",
        ]}
      />
    </FeaturePage>
  );
}
