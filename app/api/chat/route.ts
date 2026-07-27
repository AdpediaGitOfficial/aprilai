import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getModel } from "@/lib/ai/provider";
import { getSystemPrompt, type PromptKey } from "@/lib/ai/prompts";

export const maxDuration = 60;

type ChatRequestBody = {
  messages?: unknown;
  promptKey?: PromptKey;
};

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { messages, promptKey } = body;
  if (!Array.isArray(messages)) {
    return new Response("Messages are required", { status: 400 });
  }

  try {
    const result = streamText({
      model: getModel(),
      system: getSystemPrompt(promptKey),
      messages: await convertToModelMessages(messages as UIMessage[]),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages as UIMessage[],
    });
  } catch (error) {
    console.error("[/api/chat]", error);
    const message =
      error instanceof Error ? error.message : "Unexpected error generating a response.";
    return new Response(message, { status: 500 });
  }
}
