import { deepseek } from "@ai-sdk/deepseek";
import { type CoreMessage, streamObject, streamText, tool } from "ai";
import * as readline from "node:readline/promises";
import dotenv from "dotenv";
import { z } from "zod";
import SYSTEM_PROMPT from "@/app/ai/chat-v3/new-system-prompt";
import updateScene from "@/app/api/chat-claude/scene-updater";
import {
  CreateSceneArgsSchema,
  UpdateSceneToolSchema__OtherModel,
} from "@/app/api/chat-claude/shared-types";

dotenv.config();

const model = deepseek("deepseek-chat");

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
      model,
      system: SYSTEM_PROMPT,
      messages,
      tools: {
        createScene: {
          description: `Create a video scene and add 3 points for improvements.
        Required:
        - Scene configuration with valid components with unique identifier
        - EXACTLY 3 contextual suggestions based on:
          1. Missing/underutilized components
          2. Visual elements (colors, animations, layout)
          3. Timing and flow
        Suggestions must be specific and actionable.`,
          parameters: CreateSceneArgsSchema,
          execute: async (
            sceneConfig: z.infer<typeof CreateSceneArgsSchema>,
          ) => {
            const { suggestedImprovements, ...leanSceneConfig } = sceneConfig;
            console.log("createScene", { sceneConfig });

            return {
              sceneId: leanSceneConfig.id,
              sceneConfig: leanSceneConfig,
              suggestedImprovements,
            };
          },
        },

        updateScene: {
          description: `Updates an existing scene with new properties or components while maintaining scene integrity.

    Requirements:
    - Scene ID must match existing scene
    - Components require action: "add", "update", or "remove"
      - Action "add": Requires all mandatory fields and add a uuid
      - Action "update": Only changed fields needed
      - Action "remove": Only index needed
    - Original scene data required for context
    - Valid update parameters respecting component limits
    - EXACTLY 3 new contextual suggestions based on updated scene

    Component Limits:
    - Text: maximum 10 components
    - Image: maximum 5 components
    - Transition: exactly 1 component

    Validation:
    - Duration: 0.5-30 seconds
    - Font size: 8-72px
    - Position: 0-100 range
    - Components cannot exceed scene duration`,

          parameters: UpdateSceneToolSchema__OtherModel,
          execute: async ({
            id,
            update,
          }: z.infer<typeof UpdateSceneToolSchema__OtherModel>) => {
            console.log({
              id,
              update: JSON.stringify(update),
              originalScene: JSON.stringify(update.originalScene),
            });

            const { originalScene, ...updates } = update;
            const updatedScene = updateScene({
              id,
              updates,
              originalScene: update.originalScene?.sceneConfig,
            });

            return {
              sceneId: id,
              sceneConfig: updatedScene,
            };
          },
        },
      },
      onStepFinish: (step) => {
        console.log(
          " ------------------------------------------------------------------------ ",
        );

        console.dir(
          { step: step.toolCalls },
          {
            depth: null,
          },
        );
        console.log(
          " ------------------------------------------------------------------------ ",
        );
      },
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
