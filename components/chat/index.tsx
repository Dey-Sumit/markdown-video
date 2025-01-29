"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ChatRequestOptions, CreateMessage } from "ai";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Loader2, Square, Send } from "lucide-react";
import { Button } from "../ui/button";
import { type Message, useChat } from "ai/react";
import ChatMessage from "./chat-message";
/* const MESSAGES = [
  {
    id: "nF6Y97KIeQXn1fVr",
    createdAt: "2025-01-23T23:10:39.780Z",
    role: "user",
    content: "create a scene with red background and hello world text",
  },
  {
    id: "KUZMzfF0KQQND7ci",
    role: "assistant",
    content: "",
    createdAt: "2025-01-23T23:10:46.522Z",
    toolInvocations: [
      {
        state: "result",
        toolCallId: "call_9IhxC2cYKZkkpG1z62GQFuDZ",
        toolName: "createScene",
        args: {
          id: "unique_scene_id_001",
          sceneProps: {
            duration: 5,
            background: "red",
          },
          components: {
            text: [
              {
                content: "Hello World",
                animation: "fadeIn",
                id: "text_component_001",
              },
            ],
          },
          suggestedImprovements: [
            "Consider adding an image for visual interest.",
            "Experiment with a slideIn animation for the text to enhance entry effect.",
            "Adjust the scene duration to better fit the content if necessary.",
          ],
        },
        result: {
          sceneId: "unique_scene_id_001",
          sceneConfig: {
            id: "unique_scene_id_001",
            sceneProps: {
              duration: 5,
              background: "red",
            },
            components: {
              text: [
                {
                  content: "Hello World",
                  animation: "fadeIn",
                  id: "text_component_001",
                },
              ],
            },
          },
          suggestedImprovements: [
            "Consider adding an image for visual interest.",
            "Experiment with a slideIn animation for the text to enhance entry effect.",
            "Adjust the scene duration to better fit the content if necessary.",
          ],
        },
      },
    ],
    revisionId: "8xiCW1DEbRFt13J9",
  },
  {
    id: "TxiMk9CkfnUux8jn",
    role: "assistant",
    content:
      'Created scene with red background and centered text saying "Hello World". Here are some suggestions for improvement:\n1. Consider adding an image for visual interest.\n2. Experiment with a slideIn animation for the text to enhance the entry effect.\n3. Adjust the scene duration to better fit the content if necessary.',
    createdAt: "2025-01-23T23:10:47.722Z",
    revisionId: "556gSR65kc18FbjW",
  },
];
 */

export type ChatAppend = (
  message: Message | CreateMessage,
  chatRequestOptions?: ChatRequestOptions,
) => Promise<string | null | undefined>;

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
    api: "/api/chat-claude",
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
              <ChatMessage message={m} append={append} />
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="absolute bottom-0 w-full border-t border-neutral-800 bg-black p-4"
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

export default AIChat;
