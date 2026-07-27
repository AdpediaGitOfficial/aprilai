"use client";

import { useCallback, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { EmptyView } from "./empty-view";
import { MessageList, type ChatContext } from "./message-list";
import { Composer } from "./composer";
import { onNewChat } from "@/lib/events";
import type { PromptKey } from "@/lib/ai/prompts";

const DEFAULT_CONTEXT: ChatContext = {
  label: "Legal Advice",
  sub: "Private consultation · India jurisdiction",
};

export function ChatPanel({
  promptKey = "general",
  showProCta = true,
  context = DEFAULT_CONTEXT,
  conversationId,
  initialMessages,
}: {
  promptKey?: PromptKey;
  showProCta?: boolean;
  context?: ChatContext;
  conversationId?: string;
  initialMessages?: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(true);
  const [chatId, setChatId] = useState(() => conversationId ?? crypto.randomUUID());

  const { messages, sendMessage, status, stop, regenerate, setMessages } = useChat({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat", body: { promptKey } }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const hasMessages = messages.length > 0;

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
  };

  const newConversation = useCallback(() => {
    stop();
    setMessages([]);
    setInput("");
    setChatId(crypto.randomUUID());
  }, [stop, setMessages]);

  // Reset when the shell (sidebar / palette) requests a new chat.
  useEffect(() => onNewChat(newConversation), [newConversation]);

  return (
    <>
      {hasMessages ? (
        <MessageList
          messages={messages}
          isLoading={isLoading}
          status={status}
          onStop={stop}
          onRegenerate={() => regenerate()}
          context={context}
        />
      ) : (
        <EmptyView onPick={submit} />
      )}

      <div className="relative border-t border-border/60 bg-background/40 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 -top-16 h-16 bg-gradient-to-t from-background to-transparent" />
        <div className="mx-auto w-full max-w-3xl px-6 py-4">
          <Composer
            input={input}
            setInput={setInput}
            webSearch={webSearch}
            setWebSearch={setWebSearch}
            onSubmit={() => submit(input)}
            isLoading={isLoading}
            onStop={stop}
          />
          {!hasMessages && showProCta && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Unlock all the benefits of top AI — all in one place.{" "}
              <button className="font-medium text-foreground underline decoration-primary/50 underline-offset-4 hover:text-primary transition-colors">
                Activate Pro.
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
