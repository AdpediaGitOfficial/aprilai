import { createUIMessageStream, createUIMessageStreamResponse, type UIMessage } from "ai";

/**
 * Zero-config demo mode. When no provider key is set, the chat still works: this
 * streams a canned, markdown-formatted reply through the same UI-message-stream
 * protocol the real model uses — so the entire UX is testable with no keys or
 * external services. Swapping in a real key replaces this automatically.
 */

function lastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return (
    lastUser?.parts
      .map((p) => (p.type === "text" ? (p.text ?? "") : ""))
      .join("")
      .trim() ?? ""
  );
}

function buildReply(question: string): string {
  const quoted = question ? `> ${question}\n\n` : "";
  return (
    `${quoted}**April here — running in demo mode.** No AI provider key is ` +
    `configured, so this is a local placeholder response rather than a real ` +
    `model generation.\n\n` +
    `Here's what a real answer would include:\n\n` +
    `- **Short answer** — a direct response to your question\n` +
    `- **Reasoning** — the legal principles that apply\n` +
    `- **Relevant law** — statutes or precedent, with jurisdictions cited\n` +
    `- **Next steps** — concrete actions to consider\n\n` +
    `To get real answers, set \`ANTHROPIC_API_KEY\` (or \`OPENAI_API_KEY\` with ` +
    `\`AI_PROVIDER=openai\`) in \`.env.local\` and restart.\n\n` +
    `*Everything else — navigation, streaming, markdown, tool pills, document ` +
    `uploads, conversation history — is fully functional once its service is ` +
    `configured.*\n\n` +
    `_Demo mode · not legal advice._`
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function streamDemoResponse(messages: UIMessage[]): Response {
  const reply = buildReply(lastUserText(messages));
  const tokens = reply.match(/\S+\s*/g) ?? [reply];

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const id = "demo-text";
      writer.write({ type: "text-start", id });
      for (const token of tokens) {
        writer.write({ type: "text-delta", id, delta: token });
        await sleep(18);
      }
      writer.write({ type: "text-end", id });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
