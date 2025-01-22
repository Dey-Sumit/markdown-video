import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          return {
            value: 24,
            unit: "celsius",
            weeklyForecast: [
              { day: "Monday", value: 24 },
              { day: "Tuesday", value: 25 },
              { day: "Wednesday", value: 26 },
              { day: "Thursday", value: 27 },
              { day: "Friday", value: 28 },
              { day: "Saturday", value: 29 },
              { day: "Sunday", value: 30 },
            ],
          };
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: z.object({
          message: z.string().describe("The message to ask for confirmation."),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          "Get the user location. Always ask for confirmation before using this tool.",
        parameters: z.object({}),
      },
    },
  });

  return result.toDataStreamResponse();
}
