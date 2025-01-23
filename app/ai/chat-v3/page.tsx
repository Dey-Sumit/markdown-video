"use client";

import React from "react";
import AIChat from "@/components/chat";

export default function ChatUI() {
  return (
    <div className="mx-auto mt-auto flex h-full min-h-[90vh] w-full max-w-screen-md flex-col border bg-neutral-950">
      <AIChat />
    </div>
  );
}
