import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { getModel } from "@/lib/ai/provider";
import { getSystemPrompt, type PromptKey } from "@/lib/ai/prompts";
import { buildTools } from "@/lib/ai/tools";
import { dbEnabled } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth/user";
import { saveConversation } from "@/lib/db/conversations";

export const maxDuration = 60;

type ChatRequestBody = {
  id?: string;
  messages?: unknown;
  promptKey?: PromptKey;
  webSearch?: boolean;
};

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { id, messages, promptKey = "general", webSearch = false } = body;
  if (!Array.isArray(messages)) {
    return new Response("Messages are required", { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    const tools = buildTools({ userId: user.id, webSearch });

    const result = streamText({
      model: getModel(),
      system: getSystemPrompt(promptKey),
      messages: await convertToModelMessages(messages as UIMessage[]),
      tools,
      // Allow the model to call a tool, read the result, then answer.
      stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages as UIMessage[],
      onFinish: async ({ messages: finalMessages }) => {
        if (!dbEnabled || !id) return;
        try {
          await saveConversation({
            userId: user.id,
            conversationId: id,
            promptKey,
            messages: finalMessages,
          });
        } catch (err) {
          console.error("[/api/chat] persist failed", err);
        }
      },
    });
  } catch (error) {
    console.error("[/api/chat]", error);
    const message =
      error instanceof Error ? error.message : "Unexpected error generating a response.";
    return new Response(message, { status: 500 });
  }
}
