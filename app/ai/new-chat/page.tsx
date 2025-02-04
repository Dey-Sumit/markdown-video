"use client";

import { useState, useRef, useEffect, useCallback } from "react";
// import { Plus, Globe, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "./chat-message";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { SendHorizontal } from "lucide-react";

async function* mockStreamingContent() {
  const content = `Here's an example of a code block without a specified language:

\`\`\`
## !scene --duration=3 --background="#2E3192"
!transition --type=fade --duration=0.3
!text --content="Hello World" --color=white --fontSize=120 --animation=fadeInSlideUp
\`\`\`

And here's a TypeScript example:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function formatUser(user: User): string {
  return \`\${user.name} (\${user.email})\`;
}
\`\`\`
`;

  const chunks = content.split(" ");
  for (const chunk of chunks) {
    yield chunk + " ";
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

export default function Home() {
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "/api/text-output",
      onToolCall: async ({ toolCall }) => {
        console.log("Tool Call", toolCall.toolName);
      },
      maxSteps: 2,
      onFinish: () => setIsStreaming(false),
    });

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    scrollToBottom();
  }, [messages]); // Added scrollToBottom to dependencies

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsStreaming(true);
      handleSubmit(e);
    },
    [handleSubmit],
  );
  /*   const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: inputValue },
      { role: "assistant", content: "" },
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsStreaming(true);

    const streamContent = mockStreamingContent();
    let assistantResponse = "";

    for await (const chunk of streamContent) {
      assistantResponse += chunk;
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "assistant", content: assistantResponse },
      ]);
    }

    setIsStreaming(false);
  }; */

  return (
    <div className="flex h-screen flex-col bg-[#121212] text-zinc-50">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4"
      >
        <div className="mx-auto w-full max-w-3xl space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          {isStreaming && (
            <div className="ml-8 flex gap-2">
              <span className="text-base">Generating</span>
              <div className="flex items-center space-x-2">
                <div className="size-1.5 animate-pulse rounded-full bg-gray-300"></div>
                <div className="size-1.5 animate-pulse rounded-full bg-gray-300 delay-300"></div>
                <div className="size-1.5 animate-pulse rounded-full bg-gray-300 delay-700"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-transparent p-4 pt-0 shadow-2xl">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Message"
              className="w-full resize-none overflow-hidden rounded-xl bg-[#2A2A2A] px-4 py-3 pr-12 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="group absolute bottom-2 right-2 grid place-items-center rounded-lg p-1.5"
              onClick={isStreaming ? stop : handleFormSubmit}
              disabled={isLoading || !input}
            >
              <SendHorizontal className="" strokeWidth={1.5} size={20} />
            </Button>
          </div>
        </form>
      </div>
      {/* <div className="border-t border-zinc-800 bg-[#1A1A1A] p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message"
              className="w-full resize-none overflow-hidden rounded-xl bg-[#2A2A2A] px-4 py-3 pr-12 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 rounded-lg"
              disabled={isStreaming}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.33337 14.6667L15.3334 8.00004L1.33337 1.33337V6.66671L11.3334 8.00004L1.33337 9.33337V14.6667Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A]"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-full bg-[#2A2A2A] px-4 text-sm font-medium hover:bg-[#3A3A3A]"
            >
              <Globe className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-full bg-[#2A2A2A] px-4 text-sm font-medium hover:bg-[#3A3A3A]"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Reason
            </Button>
          </div>
        </form>
      </div> */}
    </div>
  );
}
