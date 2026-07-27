import { ChatPanel } from "@/features/chat/chat-panel";
import { getCurrentUser } from "@/lib/auth/user";
import { getConversationMessages } from "@/lib/db/conversations";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;

  let conversationId: string | undefined;
  let initialMessages = undefined;

  if (c) {
    const user = await getCurrentUser();
    const history = await getConversationMessages(user.id, c);
    if (history.length > 0) {
      conversationId = c;
      initialMessages = history;
    }
  }

  return (
    <ChatPanel
      key={conversationId ?? "new"}
      promptKey="general"
      conversationId={conversationId}
      initialMessages={initialMessages}
    />
  );
}
