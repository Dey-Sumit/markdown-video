import SYSTEM_PROMPT from "@/app/ai/chat-v3/system-prompt";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

// Define our component schemas
const TextComponentSchema = z.object({
  content: z.string(),
  animation: z.enum(["fadeIn", "slideIn", "zoomIn"]),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  style: z
    .object({
      fontSize: z.number().optional(),
      color: z.string().optional(),
      fontWeight: z.string().optional(),
    })
    .optional(),
});

const ImageComponentSchema = z.object({
  src: z.string(),
  animation: z.enum(["fadeIn", "zoomIn", "slideIn"]),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  size: z
    .object({
      width: z.number(),
      height: z.number(),
    })
    .optional(),
});

const TransitionComponentSchema = z.object({
  type: z.enum(["fade", "wipe", "dissolve"]),
  duration: z.number(),
});

const SceneSchema = z.object({
  id: z.string(),
  duration: z.number(),
  name: z.string().optional(),
  background: z.string().optional(),
  components: z.object({
    text: z.array(TextComponentSchema).optional(),
    image: z.array(ImageComponentSchema).optional(),
    transition: z.array(TransitionComponentSchema).max(1).optional(),
  }),
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    system: SYSTEM_PROMPT,
    onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      console.log("Step Finished", {
        text,
        toolCalls,
        toolResults,
        finishReason,
        usage,
      });

      // your own logic, e.g. for saving the chat history or recording usage
    },
    tools: {
      validateScene: {
        description:
          "Validate the scene configuration and provide detailed error feedback",
        parameters: SceneSchema,
        execute: async (sceneConfig) => {
          // Simple validation - check if duration is positive
          if (sceneConfig.duration <= 0) {
            return {
              valid: false,
              errors: [{ message: "Duration must be positive" }],
            };
          }

          // Check if there's at least one component
          const hasComponents = Object.values(sceneConfig.components).some(
            (arr) => arr?.length > 0,
          );
          if (!hasComponents) {
            return {
              valid: false,
              errors: [{ message: "Scene must have at least one component" }],
            };
          }

          return { valid: true, scene: sceneConfig };
        },
      },

      createScene: {
        description:
          "Create a new video scene with the specified configuration",
        parameters: SceneSchema,
        execute: async (sceneConfig) => {
          return {
            success: true,
            sceneId: sceneConfig.id,
            sceneConfig,
          };
        },
      },
    },
  });

  // console.log("toolCalls : ", await result.toolCalls);
  // console.log("toolResults : ", await result.toolResults);
  return result.toDataStreamResponse();
}
