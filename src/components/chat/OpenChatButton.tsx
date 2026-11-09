"use client";

import { openChat } from "./chat-bus";

export function OpenChatButton({
  children,
  className,
  prefill,
}: {
  children: React.ReactNode;
  className?: string;
  prefill?: string;
}) {
  return (
    <button type="button" className={className} onClick={() => openChat(prefill)}>
      {children}
    </button>
  );
}
