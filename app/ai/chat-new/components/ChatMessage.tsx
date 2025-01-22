import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant" | "system" | "data";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div
      className={`mb-4 flex items-start ${role === "assistant" ? "justify-start" : "justify-end"}`}
    >
      {role === "assistant" && <Bot className="mr-2 h-6 w-6 text-blue-500" />}
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          role === "assistant"
            ? "bg-gray-800 text-gray-200"
            : "bg-blue-900 text-blue-100"
        }`}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      {role === "user" && <User className="ml-2 h-6 w-6 text-blue-500" />}
    </div>
  );
}
