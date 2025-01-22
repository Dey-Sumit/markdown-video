"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ChatMessage as ChatMessageType } from "@/types";
import { ChatMessage } from "./components/ChatMessage";
import { ToolInvocations } from "./components/ToolInvocations";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat-new",
      maxSteps: 10,
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-gray-100">
      <Card className="m-4 flex h-full flex-col border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle>Video Editor Assistant</CardTitle>
        </CardHeader>
        <CardContent className="mb-4 flex-grow overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id}>
              {message.role === "assistant" && message.content && (
                <ChatMessage role={message.role} content={message.content} />
              )}
              {message.toolInvocations && (
                <ToolInvocations toolInvocations={message.toolInvocations} />
              )}
              {message.role === "user" && (
                <ChatMessage role={message.role} content={message.content} />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="mb-4 flex items-center justify-start">
              <div className="rounded-lg bg-gray-800 p-3 text-gray-200">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow border-gray-600 bg-gray-700 text-gray-100"
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
