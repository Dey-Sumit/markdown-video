import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { tools } from "@/lib/tools";
import SYSTEM_PROMPT from "./system-prompt";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    system: SYSTEM_PROMPT,
    tools: tools,
  });

  return result.toDataStreamResponse();
}
