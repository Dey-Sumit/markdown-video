import { type CoreMessage, generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4"),
    system:
      "My app creates video from text. You are an assistant helping a user create a scene of a video. A video is a series of scenes. Each scene has a name.",
    messages,
    schema: z.object({
      scene: z.object({
        props: z.object({
          name: z.string().describe("Name of a scene"),
          duration: z.number().describe("Duration of the scene in seconds"),
          background: z.string().describe("Background of the scene"),
        }),
        textComponent: z.array(
          z.object({
            content: z.string().describe("Content of the text"),
            position: z.object({
              x: z.number().describe("X position of the text"),
              y: z.number().describe("Y position of the text"),
            }),
            style: z.object({
              fontSize: z.number().describe("Font size of the text"),
              color: z.string().describe("Color of the text"),
            }),
          }),
        ),
      }),
    }),
  });
  console.log({ result });

  return result.toJsonResponse();
}
