import { cn } from "@/lib/utils";
import type { Message } from "ai";
import { User, Bot } from "lucide-react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";

const ChatLeanMessage = memo(({ message }: { message: Message }) => (
  <div className="flex items-start gap-3">
    {message.role === "user" ? (
      <User className="mt-1 h-5 w-5 flex-shrink-0 text-purple-500" />
    ) : (
      <Bot className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
    )}
    <div
      className={cn(
        "prose prose-neutral max-w-none text-sm dark:prose-invert",
        {
          "text-purple-500": message.role === "user",
          "text-white": message.role !== "user",
        },
      )}
    >
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  </div>
));
ChatLeanMessage.displayName = "ChatMessage";

export default ChatLeanMessage;
