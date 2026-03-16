"use client";

import { useState } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { useAgentDetail } from "@/hooks/use-agent-detail";
import { Spinner } from "@/components/tui/spinner";
import { fileToBase64 } from "@/lib/cursor-api";

interface AgentChatProps {
  agentId: string;
}

export function AgentChat({ agentId }: AgentChatProps) {
  const { agent, messages, mutateConv } = useAgentDetail(agentId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (text: string, images?: File[]) => {
    if (!text.trim() && (!images || images.length === 0)) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 准备 payload
      const payload: { text: string; images?: Array<{ data: string; mimeType: string; filename: string }> } = { text };
      
      // 如果有图片，转换为 base64
      if (images && images.length > 0) {
        payload.images = await Promise.all(
          images.map(async (file) => ({
            data: await fileToBase64(file),
            mimeType: file.type,
            filename: file.name,
          }))
        );
      }
      
      const res = await fetch(`/api/agents/${agentId}/followup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to send message" }));
        throw new Error(err.error || "Failed to send message");
      }
      
      // 刷新对话
      await mutateConv();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!agent) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner text="Loading agent..." />
      </div>
    );
  }

  const canSendMessage = agent.status === "RUNNING" || agent.status === "CREATING";

  return (
    <div className="flex flex-col h-full bg-black border border-white/20 font-mono">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-white/40 text-sm py-8">
            No messages yet. Start a conversation...
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {loading && (
          <div className="text-white/40 text-sm">
            <Spinner text="Sending..." />
          </div>
        )}
        {error && (
          <div className="text-red-400 text-sm">[error] {error}</div>
        )}
      </div>

      {/* 输入框 */}
      {canSendMessage ? (
        <ChatInput
          onSubmit={handleSendMessage}
          placeholder="Type your message or upload images..."
          disabled={loading}
          loading={loading}
        />
      ) : (
        <div className="p-4 border-t border-white/20 text-center text-white/40 text-sm">
          Agent is {agent.status.toLowerCase()}. Cannot send messages.
        </div>
      )}
    </div>
  );
}
