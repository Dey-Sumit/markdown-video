import SYSTEM_PROMPT from "@/app/ai/chat-v3/system-prompt";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { SceneConfigSchema, UpdateSceneToolSchema } from "./shared-types";
import { sceneConfig } from "@/components/x-editor/plugins/scene/scene.config";
import { updater } from "./scene-updater";

const model = openai("gpt-4-turbo");
/* export const UpdateSceneToolSchema = z.object({
  id: z.string().describe("ID of scene to update"),
  update: z.object({
    sceneProps: z
      .object({
        duration: z.number().min(0.5).max(30).optional(),
        background: z.string().optional(),
      })
      .optional(),
    components: z
      .object({
        text: z
          .array(
            z.object({
              index: z.number().min(0).max(9),
              content: z.string().optional(),
              animation: z.enum(["fadeIn", "slideIn", "zoomIn"]).optional(),
            }),
          )
          .optional(),
        image: z
          .array(
            z.object({
              index: z.number().min(0).max(4),
              src: z.string().optional(),
              animation: z.enum(["fadeIn", "zoomIn", "slideIn"]).optional(),
            }),
          )
          .optional(),
        transition: z
          .array(
            z.object({
              type: z.enum(["fade", "wipe", "dissolve"]).optional(),
              duration: z.number().min(0.5).optional(),
            }),
          )
          .max(1)
          .optional(),
      })
      .optional(),
  }),
  originalScene: CreateSceneToolSchema, // Your existing scene config schema
}); */

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model,
    messages,
    system: SYSTEM_PROMPT,
    abortSignal: request.signal,
    onStepFinish: (step) => {
      console.log({ toolCalls: step.toolCalls });
    },
    tools: {
      createScene: {
        description: `Create a video scene and analyze for improvements.
        Required:
        - Scene configuration with valid components
        - EXACTLY 3 contextual suggestions based on:
          1. Missing/underutilized components
          2. Visual elements (colors, animations, layout)
          3. Timing and flow
        Suggestions must be specific and actionable.`,
        parameters: SceneConfigSchema,
        execute: async (sceneConfig: z.infer<typeof SceneConfigSchema>) => {
          const { suggestedImprovements, ...leanSceneConfig } = sceneConfig;
          return {
            sceneId: "custom-scene-id",
            sceneConfig: leanSceneConfig,
            suggestedImprovements,
          };
        },
      },

      updateScene: {
        description: `Updates an existing scene with new properties or components while maintaining scene integrity.
    
    Requirements:
    - Scene ID must match existing scene
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
        parameters: UpdateSceneToolSchema,
        execute: async ({
          id,
          update,
        }: z.infer<typeof UpdateSceneToolSchema>) => {
          // const updatedScene = sceneUpdater.updateScene({
          //   id,
          //   update,
          //   originalScene,
          // });
          console.log({ id, update, sceneConfig: JSON.stringify(update) });

          const updatedScene = updater.updateScene({
            id,
            update,
            originalScene: update.originalScene,
          });

          return {
            sceneId: id,
            updatedScene,
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
