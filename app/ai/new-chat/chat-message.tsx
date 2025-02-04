import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownFormatter } from "./markdown-formatter";
import { cn } from "@/utils/cn";
import type { Message } from "ai";

interface ChatMessageProps {
  content: string;
  role: Message["role"];
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, role }) => {
  return (
    <div className="mb-4 flex items-start space-x-4">
      <Avatar
        className={cn(
          "mt-1 flex-shrink-0",
          role === "user" ? "bg-green-900" : "bg-blue-900",
        )}
      >
        <AvatarImage
          src={role === "user" ? "/user-avatar.png" : "/assistant-avatar.png"}
        />
        <AvatarFallback className="bg-transparent">
          {role === "user" ? "U" : "A"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div
          className={`rounded-lg p-4 ${role === "user" ? "bg-zinc-800" : "bg-zinc-800"} break-words`}
        >
          <MarkdownFormatter content={content} />
        </div>
      </div>
    </div>
  );
};
