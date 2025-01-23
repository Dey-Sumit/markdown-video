import { cn } from "@/lib/utils";
import type { Message, ToolInvocation } from "ai";
import { User, Bot } from "lucide-react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import ToolResponse from "./tool-response";
import type { ChatAppend } from ".";

const ChatLeanMessage = memo(
  ({ message, append }: { message: Message; append: ChatAppend }) => (
    <div className={cn("flex items-start gap-3")}>
      {message.role === "user" ? (
        <User className="mt-4 h-5 w-5 flex-shrink-0 text-white" />
      ) : (
        <Bot className="mt-4 h-5 w-5 flex-shrink-0 text-white" />
      )}
      <div className="flex w-full flex-col gap-2">
        {message.content && (
          <div
            className={cn(
              "prose prose-neutral max-w-none rounded-md border p-4 text-sm dark:prose-invert",
              {
                "border border-[#1d1d1d50] bg-[#131313]":
                  message.role === "user",
                "border border-neutral-900 bg-neutral-900/50":
                  message.role === "assistant",
              },
            )}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {message.toolInvocations?.map((toolInvocation: ToolInvocation) => (
          <ToolResponse
            key={toolInvocation.toolCallId}
            toolInvocation={toolInvocation}
            append={append}
          />
        ))}
      </div>
    </div>
  ),
);
ChatLeanMessage.displayName = "ChatMessage";

export default ChatLeanMessage;
