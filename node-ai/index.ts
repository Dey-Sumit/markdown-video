import { openai } from "@ai-sdk/openai";
import { type CoreMessage, streamObject, streamText, tool } from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
import { z } from "zod";

dotenv.config();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question("You: ");

    messages.push({ role: "user", content: userInput });

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      tools: {
        weather: tool({
          description: "Get the weather of a city",
          parameters: z.object({
            location: z.string().describe("The location to get the weather of"),
          }),
          execute: async ({ location }) => {
            return {
              location,
              temperature: Math.round((Math.random() * 30 + 5) * 10) / 10, // Random temp between 5°C and 35°C
            };
          },
        }),
        convertCelsiusToFahrenheit: tool({
          description: "Convert a temperature from Celsius to Fahrenheit",
          parameters: z.object({
            celsius: z
              .number()
              .describe("The temperature in Celsius to convert"),
          }),
          execute: async ({ celsius }) => {
            const fahrenheit = (celsius * 9) / 5 + 32;
            return { fahrenheit: Math.round(fahrenheit * 100) / 100 };
          },
        }),
      },
      maxSteps: 5,

      system:
        "You are an AI assistant. At the end , you need to return an object with the following properties: location, temperature, fahrenheit",
    });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write("\n\n");
    // console.log(await result.toolCalls);
    // console.log(await result.toolResults);
    messages.push({ role: "assistant", content: fullResponse });
  }
}

main().catch(console.error);
