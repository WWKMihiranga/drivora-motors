"use client";

/** Tiny event bus so any button can open the chat without prop drilling. */
export const CHAT_EVENT = "drivora:open-chat";

export function openChat(prefill?: string) {
  window.dispatchEvent(new CustomEvent(CHAT_EVENT, { detail: { prefill } }));
}
