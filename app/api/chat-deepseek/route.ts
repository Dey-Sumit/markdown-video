// import SYSTEM_PROMPT from "@/app/ai/chat-v3/system-prompt";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
// import { CreateSceneConfigSchema, UpdateSceneToolSchema } from "./shared-types";
import NEW_SYSTEM_PROMPT from "@/app/ai/chat-v3/new-system-prompt";
import { deepseek } from "@ai-sdk/deepseek";
import {
  CreateSceneArgsSchema,
  UpdateSceneToolSchema__OtherModel,
  type CreateSceneArgsType,
} from "../chat-claude/shared-types";
import updateScene from "../chat-claude/scene-updater";

const model = deepseek("deepseek-chat");

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model,
    messages,
    toolCallStreaming: true,
    system: NEW_SYSTEM_PROMPT,
    abortSignal: request.signal,
    onStepFinish: (step) => {
      console.log("onStepFinish : ", {
        toolCalls: step.toolCalls.map((tc) => tc.toolName),
      });
    },
    tools: {
      createScene: {
        description: `Create a video scene and must add 3 points for improvements.
        Required:
        - Scene configuration with valid components with unique uuid identifier
        - EXACTLY 3 contextual suggestions based on:
          1. Missing/underutilized components
          2. Visual elements (colors, animations, layout)
          3. Timing and flow
        Suggestions must be specific and actionable.`,
        parameters: CreateSceneArgsSchema,
        execute: async (createSceneConfig: CreateSceneArgsType) => {
          //   const { ...leanSceneConfig } = sceneConfig;
          console.log("createScene", { createSceneConfig });

          return {
            createSceneConfig,
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
          //   console.log({
          //     id,
          //     update: JSON.stringify(update),
          //     originalScene: JSON.stringify(update.originalScene),
          //   });

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
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
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
