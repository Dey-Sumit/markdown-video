import { streamText } from "ai";

import { deepseek } from "@ai-sdk/deepseek";

import SYSTEM_PROMPT from "@/prompts/text-based-output";
import { anthropic } from "@ai-sdk/anthropic";

//const model = anthropic("claude-3-5-sonnet-latest");
const model = deepseek("deepseek-chat");

export async function POST(request: Request) {
  const { messages } = await request.json();
  console.log("messages : ", messages);

  const result = streamText({
    model,
    messages,
    toolCallStreaming: true,
    system: SYSTEM_PROMPT,
    abortSignal: request.signal,
    onStepFinish: (step) => {
      console.log("onStepFinish : ", {
        toolCalls: step.toolCalls.map((tc) => tc.toolName),
      });
    },
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
    sendUsage: true,
    
  });
}

export function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}
