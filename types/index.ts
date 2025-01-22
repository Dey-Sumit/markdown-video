import { z } from "zod";

export const createSceneSchema = z.object({
  template: z
    .string()
    .describe("The template ID to use for creating the scene"),
  customizations: z
    .record(z.any())
    .optional()
    .describe("Optional customizations for the template"),
});

export const updateComponentSchema = z.object({
  sceneId: z.string(),
  componentType: z.enum(["text", "image", "transition"]),
  componentId: z.string(),
  updates: z.record(z.any()),
});

export type CreateSceneParams = z.infer<typeof createSceneSchema>;
export type UpdateComponentParams = z.infer<typeof updateComponentSchema>;

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: z.ZodType<any>;
  execute: (args: any) => Promise<any>;
}

export interface ToolInvocation {
  id: string;
  toolName: string;
  args: Record<string, any>;
  state: "called" | "executing" | "completed" | "error";
  result?: any;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[];
}
