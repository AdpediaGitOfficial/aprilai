import type { Metadata } from "next";
import { ChatPanel } from "@/features/chat/chat-panel";

export const metadata: Metadata = { title: "Contract Drafting · April AI" };

export default function ContractDraftPage() {
  return (
    <ChatPanel
      promptKey="contractDrafting"
      showProCta={false}
      context={{ label: "Contract Drafting", sub: "Clause & agreement generation" }}
    />
  );
}
