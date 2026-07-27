import type { Metadata } from "next";
import { Files } from "lucide-react";
import { FeaturePage, ComingSoon } from "@/components/layout/feature-page";
import { DocumentsManager } from "@/features/documents/documents-manager";
import { ragEnabled } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth/user";
import { listDocuments } from "@/lib/db/documents";

export const metadata: Metadata = { title: "Documents · April AI" };

export default async function DocumentsPage() {
  const description =
    "Upload contracts and filings. April embeds them so it can ground answers in your own documents and cite them in chat.";

  if (!ragEnabled) {
    return (
      <FeaturePage icon={Files} eyebrow="Workspace" title="Documents" description={description}>
        <ComingSoon
          bullets={[
            "Set DATABASE_URL (Postgres + pgvector) and OPENAI_API_KEY to enable uploads",
            "Automatic parsing, chunking, and embedding for retrieval (RAG)",
            "Ask questions grounded in a specific document with citations",
            "Secure per-user storage",
          ]}
        />
      </FeaturePage>
    );
  }

  const user = await getCurrentUser();
  const documents = await listDocuments(user.id);

  return (
    <FeaturePage icon={Files} eyebrow="Workspace" title="Documents" description={description}>
      <DocumentsManager initial={documents} />
    </FeaturePage>
  );
}
