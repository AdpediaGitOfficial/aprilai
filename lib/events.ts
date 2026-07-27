/**
 * Lightweight cross-component signal so shell-level controls (sidebar, command
 * palette) can start a fresh conversation on the chat page without coupling the
 * `(app)` layout to page state.
 */
export const NEW_CHAT_EVENT = "april:new-chat";

export function emitNewChat() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(NEW_CHAT_EVENT));
}

export function onNewChat(handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(NEW_CHAT_EVENT, handler);
  return () => window.removeEventListener(NEW_CHAT_EVENT, handler);
}
