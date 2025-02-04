"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { MarkdownFormatter } from "./markdown-formatter";

interface StreamingMarkdownProps {
  streamingContent: AsyncIterable<string>;
}

export const StreamingMarkdown: React.FC<StreamingMarkdownProps> = ({
  streamingContent,
}) => {
  const [content, setContent] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateContent = async () => {
      for await (const chunk of streamingContent) {
        setContent((prevContent) => prevContent + chunk);
      }
    };
    updateContent();
  }, [streamingContent]);

  // Scroll to bottom when content updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef]); //Corrected dependency

  return (
    <div ref={containerRef} className="h-[calc(100vh-8rem)] overflow-y-auto">
      <MarkdownFormatter content={content} />
    </div>
  );
};
