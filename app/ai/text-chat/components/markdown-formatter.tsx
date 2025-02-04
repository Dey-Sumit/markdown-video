"use client";

import type React from "react";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "./codeblock";

interface MarkdownFormatterProps {
  content: string;
}

const LLM_CONTENT = `
Created new scene with a different background color.

\`\`\`
## !scene --duration=3 --background="#2E3192"
  !transition --type=fade --duration=0.3
  !text --content="Hello World" --color=white --fontSize=120 --animation=fadeInSlideUp
\`\`\`
`;
const CONTENT = `# Markdown Formatting Example


## Code Examples

Here's a TypeScript example:

\`\`\`
interface User {
  id: number;
  name: string;
  email: string;
}

function formatUser(user: User): string {
  return \`\${user.name} (\${user.email})\`;
}
\`\`\`


## Code Snippets

You can use \`inline code\` within paragraphs.

Here's another code example:

\`\`\`tsx
export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>Current count: {count}</p>
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Increment
      </button>
    </div>
  );
}
\`\`\`
`;

export const MarkdownFormatter: React.FC<MarkdownFormatterProps> = ({
  content,
}) => {
  return (
    <div className="prose prose-invert max-w-none prose-pre:overflow-hidden prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        components={{
          // Code blocks
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "markdown"; // Use "markdown" as fallback
            return !inline ? (
              <CodeBlock
                language={language}
                value={String(children).replace(/\n$/, "")}
              />
            ) : (
              <code
                className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Override default elements with custom styling
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold tracking-tight">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold tracking-tight">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="my-6 list-inside list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 list-inside list-decimal space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="text-zinc-300">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400">
              {children}
            </blockquote>
          ),
          p: ({ children }) => (
            <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 underline underline-offset-4 hover:text-blue-300"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
