"use client";

import { CursorMessage } from "@/lib/cursor-api";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: CursorMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user_message";
  return (
    <div className={cn("font-mono text-sm", isUser ? "text-white" : "text-white/70")}>
      <span
        className={cn(
          "text-xs mr-2 select-none",
          isUser ? "text-green-400" : "text-white/40"
        )}
      >
        [{isUser ? "user" : "assistant"}]
      </span>
      <span className="whitespace-pre-wrap break-words">{message.text}</span>
    </div>
  );
}
