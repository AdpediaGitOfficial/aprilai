import type { Metadata } from "next";
import { ChatPanel } from "@/features/chat/chat-panel";

export const metadata: Metadata = { title: "Legal Advice · April AI" };

export default function LegalAdvicePage() {
  return (
    <ChatPanel
      promptKey="legalAdvice"
      showProCta={false}
      context={{ label: "Legal Advice", sub: "Private consultation · India jurisdiction" }}
    />
  );
}
