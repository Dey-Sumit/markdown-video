"use client";
import AIChat from "@/components/chat";
import { log } from "node:console";
import React, { useState } from "react";
import AIChatComponent from "./page";
import { BotMessageSquare, CrossIcon, X } from "lucide-react";

const AiChatFAB = () => {
  const [expandChat, setExpandChat] = useState(false);
  console.log({ expandChat });

  if (expandChat) {
    return (
      <div className="absolute bottom-5 right-7 top-20 z-30 flex w-[800px] items-center justify-center overflow-hidden rounded-xl border-2 border-zinc-900 bg-zinc-950/95 backdrop-blur-3xl">
        <button
          className="absolute right-2 top-2 z-30"
          onClick={() => setExpandChat(false)}
        >
          <div className="flex size-10 items-center justify-center rounded-full border-2 border-red-900/10 bg-red-900/50 transition-transform hover:scale-95">
            <X size={18} className="text-red-200" />
          </div>
        </button>

        <div className="h-full w-full">
          <AIChatComponent renderAs="component" />
        </div>
      </div>
    );
  }
  return (
    <button
      className="absolute bottom-4 right-4 z-30 transition-transform hover:scale-110"
      onClick={() => {
        setExpandChat(!expandChat);
      }}
    >
      <div className="flex size-14 items-center justify-center rounded-full border-4 border-primary bg-primary/90">
        <BotMessageSquare />
      </div>
    </button>
  );
};

export default AiChatFAB;
