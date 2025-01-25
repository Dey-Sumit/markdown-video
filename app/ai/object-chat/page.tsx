"use client";

import { type CoreMessage } from "ai";
import { useState } from "react";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  return (
    <div>
      <input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            setMessages((currentMessages) => [
              ...currentMessages,
              { role: "user", content: input },
            ]);

            const response = await fetch("/api/chat", {
              method: "POST",
              body: JSON.stringify({
                messages: [...messages, { role: "user", content: input }],
              }),
            });

            const data = await response.json();
            console.log({ data });

            setMessages((currentMessages) => [...currentMessages, ...data]);
          }
        }}
      />

      {messages.map((message, index) => (
        <div key={`${message.role}-${index}`}>
          {typeof message.content === "string"
            ? message.content
            : message.content
                .filter((part) => part.type === "text")
                .map((part, partIndex) => (
                  <div key={partIndex}>{part.text}</div>
                ))}
        </div>
      ))}
    </div>
  );
}
