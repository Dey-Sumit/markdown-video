"use client";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "@/app/ai/chat-new/components/ChatMessage";
import ToolResponse from "./tool-response";
import ChatLeanMessage from "./chat-lean-message";
import type { ChatRequestOptions, CreateMessage, ToolInvocation } from "ai";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Square, Send } from "lucide-react";
import { Button } from "../ui/button";
import { type Message, useChat } from "ai/react";

export type ChatAppend = (
  message: Message | CreateMessage,
  chatRequestOptions?: ChatRequestOptions,
) => Promise<string | null | undefined>;

const Chat = () => {
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
    <section className="relative h-full w-full rounded-lg border-neutral-800 bg-neutral-950 shadow-sm">
      <ScrollArea className="h-full p-4 pb-24">
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
        className="absolute bottom-0 w-full border-t border-neutral-800 p-4"
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
    </section>
  );
};

export default Chat;
