import { z } from "zod";
/* import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4"),
    system: "You generate three notifications for a messages app.",
    prompt,
    schema: z.object({
      notifications: z.array(
        z.object({
          name: z.string().describe("Name of a fictional person."),
          message: z.string().describe("Do not use emojis or links."),
          minutesAgo: z.number(),
        }),
      ),
    }),
  });

  return result.toJsonResponse();
}
 */

import { type CoreMessage, generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();
  const result = await generateObject({
    model: openai("gpt-4"),
    system:
      "My app creates video from text. You are an assistant helping a user create a scene of a video. A video is a series of scenes. Each scene has a name.",
    prompt,
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

  return result.toJsonResponse();
}
