"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Plus, Pencil } from "lucide-react";

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="my-6 overflow-hidden rounded-lg border-0 bg-[#1E1E1E]">
      <div className="flex items-center justify-between border-b border-[#404040] bg-[#2D2D2D] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize text-zinc-400">
            {language}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              <Plus className="mr-1 h-3 w-3" />
              Insert
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white"
            >
              <Pencil className="mr-1 h-3 w-3" />
              Modify
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="p-4">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            background: "transparent",
            fontSize: "14px",
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
};
