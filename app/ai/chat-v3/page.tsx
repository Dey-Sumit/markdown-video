"use client";

import { type Message, useChat } from "ai/react";
import { useState } from "react";
import type { ToolInvocation } from "ai";

// Type for our scene preview component
type ScenePreview = {
  sceneId: string;
  thumbnail: string;
  duration: number;
};

export default function VideoEditor() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      api: "/api/chat-v3",
      onToolCall: async ({ toolCall }) => {
        console.log("Tool Call", toolCall);
      },
      maxSteps: 5,
    });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Preview Area */}

        {/* Chat Interface */}
        <div className="h-96 overflow-y-auto bg-white p-4">
          <div className="space-y-4">
            {messages.map((m: Message) => {
              console.log({ message: m });

              return (
                <div key={m.id} className="flex flex-col gap-2">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold">{m.role}:</span>
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  </div>

                  {/* Tool Invocations */}
                  {m.toolInvocations?.map((toolInvocation: ToolInvocation) => (
                    <RenderToolResponse
                      key={toolInvocation.toolCallId}
                      toolInvocation={toolInvocation}
                      onSceneCreated={(scene) => {
                        // addToolResult({
                        //   toolCallId: toolInvocation.toolCallId,
                        //   result: scene,
                        // });
                      }}
                      addToolResult={addToolResult}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              className="w-full rounded-lg border border-gray-300 p-2"
              value={input}
              placeholder="Describe what you want to create..."
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

// Tool Response Component
function RenderToolResponse({
  toolInvocation,
  onSceneCreated,
  addToolResult,
}: {
  toolInvocation: ToolInvocation;
  onSceneCreated: (scene: ScenePreview) => void;
  addToolResult: (result: { toolCallId: string; result: any }) => void;
}) {
  console.log({ toolInvocation });

  if (!("result" in toolInvocation)) {
    return (
      <div className="text-sm text-gray-500">
        Processing {toolInvocation.toolName}...
      </div>
    );
  }

  switch (toolInvocation.toolName) {
    case "createScene":
      const result = toolInvocation.result;
      if (result.success) {
        onSceneCreated({
          sceneId: result.sceneId,
          thumbnail: result.preview.thumbnail,
          duration: result.preview.duration,
        });
      }
      return (
        <div className="rounded-lg bg-green-50 p-2 text-sm text-green-700">
          Scene created successfully!
        </div>
      );

    case "validateScene":
      return (
        <div
          className={`rounded-lg p-2 text-sm ${
            toolInvocation.result.valid
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {toolInvocation.result.valid
            ? "Scene configuration is valid"
            : "Invalid scene configuration"}
        </div>
      );

    default:
      return (
        <div className="text-sm text-gray-500">
          {toolInvocation.toolName} completed
        </div>
      );
  }
}
