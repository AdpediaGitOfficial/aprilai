import type { Metadata } from "next";
import { ChatPanel } from "@/features/chat/chat-panel";

export const metadata: Metadata = { title: "Contract Analysis · April AI" };

export default function ContractAnalyzePage() {
  return (
    <ChatPanel
      promptKey="contractAnalysis"
      showProCta={false}
      context={{ label: "Contract Analysis", sub: "Risk & clause review" }}
    />
  );
}
