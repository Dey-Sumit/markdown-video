"use client";

import { type Message, useChat } from "ai/react";
import React, { useState, useCallback, useMemo } from "react";
import type { ToolInvocation } from "ai";
import { Send, User, Bot, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import SceneConfigDisplay from "./scene-config-display";
import ChatLeanMessage from "@/components/chat/chat-lean-message";
import ToolResponse from "@/components/chat/tool-response";

export default function ChatUI() {
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    isLoading,
    stop,
    append,
  } = useChat({
    api: "/api/chat-v3",
    onToolCall: async ({ toolCall }) => {
      console.log("Tool Call", toolCall);
    },
    maxSteps: 5,
    onFinish: () => setIsStreaming(false),
  });

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsStreaming(true);
      handleSubmit(e);
    },
    [handleSubmit],
  );

  const memoizedMessages = useMemo(() => messages, [messages]);
  console.log({ messages });

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-neutral-950 shadow-sm">
        <div className="border-b border-neutral-800 p-4">
          <h1 className="text-lg font-semibold">Chat UI</h1>
        </div>
        <ScrollArea className="h-[80vh] p-4">
          <div className="space-y-6">
            {memoizedMessages.map((m: Message) => (
              <div key={m.id} className="space-y-2">
                <ChatLeanMessage message={m} />
                {m.toolInvocations?.map((toolInvocation: ToolInvocation) => (
                  <ToolResponse
                    key={toolInvocation.toolCallId}
                    toolInvocation={toolInvocation}
                    addToolResult={addToolResult}
                    append={append}
                  />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>

        <form
          onSubmit={handleFormSubmit}
          className="border-t border-neutral-800 p-4"
        >
          <div className="flex items-center gap-2">
            <Input
              className="flex-1 text-sm"
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
            />
            <Button
              type={isStreaming ? "button" : "submit"}
              onClick={isStreaming ? stop : undefined}
              className={cn(
                "transition-all duration-200 ease-in-out",
                isStreaming ? "bg-red-500 hover:bg-red-600" : "",
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isStreaming ? (
                <Square className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
