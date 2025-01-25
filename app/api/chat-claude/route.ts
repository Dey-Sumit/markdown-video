import { streamText } from "ai";
import { z } from "zod";
import {
  CreateSceneArgsSchema,
  UpdateSceneToolSchema__Claude,
  type CreateSceneArgsType,
} from "./shared-types";
import SYSTEM_PROMPT from "@/app/ai/chat-v3/system-prompt-claude";
import updateScene from "./scene-updater";
import { anthropic } from "@ai-sdk/anthropic";
import { attachIdsToScenes } from "./utils";
import { deepseek } from "@ai-sdk/deepseek";

const model = deepseek("deepseek-chat");
// const model = anthropic("claude-3-5-sonnet-latest");
// const model = openai("gpt-4-turbo");

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model,
    messages,
    system: SYSTEM_PROMPT,
    abortSignal: request.signal,
    onStepFinish: (step) => {
      console.log({ toolCalls: step.toolCalls.map((tc) => tc.toolName) });
    },
    experimental_providerMetadata: {
      anthropic: { cacheControl: { type: "ephemeral" } },
    },
    tools: {
      createScene: {
        description: `Create a video scene and add 3 points for improvements.
        Required:
        - Scene configuration with valid components with unique uuid identifier
        - EXACTLY 3 contextual suggestions based on:
          1. Missing/underutilized components
          2. Visual elements (colors, animations, layout)
          3. Timing and flow
        Suggestions must be specific and actionable.`,
        parameters: CreateSceneArgsSchema,

        execute: async (createSceneConfig: CreateSceneArgsType) => {
          const { suggestedImprovements, scenes } = createSceneConfig;

          return {
            scenes: attachIdsToScenes(scenes),
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
    - Valid update parameters 
    
`,

        parameters: UpdateSceneToolSchema__Claude,
        execute: async ({
          id,
          updates,
          originalScene,
        }: z.infer<typeof UpdateSceneToolSchema__Claude>) => {
          console.log("inside execute updateScene : ");

          console.dir(
            {
              id,
              updates,
              originalScene,
            },
            { depth: null },
          );

          const updatedScene = updateScene({
            id,
            updates: updates,
            originalScene: originalScene.sceneConfig,
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
  console.log("errorHandler", error);

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
