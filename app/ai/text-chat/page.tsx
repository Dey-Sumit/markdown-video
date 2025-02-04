"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatMessage from "@/components/chat/chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { useChat } from "ai/react";
import { Loader2, Square, Send } from "lucide-react";
import { MarkdownFormatter } from "./components/markdown-formatter";

const AIChat = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
  } = useChat({
    api: "/api/text-output",
    onToolCall: async ({ toolCall }) => {
      console.log("Tool Call", toolCall.toolName);
    },
    maxSteps: 2,
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <section className="relative h-full w-full flex-grow rounded-lg border-neutral-800 bg-neutral-950 shadow-sm">
      <div
        className="h-full max-w-full overflow-y-scroll p-4 pb-24"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((m: Message) => (
            <div key={m.id} className="space-y-2">
              <MarkdownFormatter content={m.content} />
              {/* {m.content} */}
              {/* <ChatMessage message={m} append={append} /> */}
            </div>
          ))}
        </div>
      </div>

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
            disabled={isLoading || !input}
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

export default function ChatUI() {
  return (
    <div className="mx-auto mt-auto flex h-full min-h-[90vh] w-full max-w-screen-md flex-col border bg-neutral-950">
      <AIChat />
    </div>
  );
}
