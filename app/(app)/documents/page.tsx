import type { Metadata } from "next";
import { Files } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";

export const metadata: Metadata = { title: "Documents · April AI" };

export default function DocumentsPage() {
  return (
    <FeaturePage
      icon={Files}
      eyebrow="Workspace"
      title="Documents"
      description="Upload, organize, and reference your legal documents. April can read them to ground its answers in your own contracts and filings."
    >
      <ComingSoon
        bullets={[
          "Drag-and-drop upload for PDFs, DOCX, and scans",
          "Automatic parsing, chunking, and embedding for retrieval (RAG)",
          "Ask questions grounded in a specific document with citations",
          "Version history and secure per-user storage",
        ]}
      />
    </FeaturePage>
  );
}
