"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./code-block";

interface MarkdownFormatterProps {
  content: string;
}

export const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({
  content,
}) => {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "markdown";
            return !inline ? (
              <CodeBlock
                language={language}
                value={String(children).replace(/\n$/, "")}
              />
            ) : (
              <code
                className="rounded bg-zinc-700 px-1 py-0.5 text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Prevent <p> from wrapping <pre>
          p({ children }) {
            return <div className="mb-4">{children}</div>;
          },
          // Custom handling for pre to avoid nesting issues
          pre({ children }) {
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
