import { z } from "zod";

// Define our component schemas
export const TextComponentSchema = z.object({
  content: z.string().describe("Content of the text"),
  animation: z
    .enum(["fadeIn", "slideIn", "zoomIn"])
    .default("fadeIn")
    .describe("Animation effect for the text"),
  id: z.string().describe("Unique uuid for the component"),
});

export const ImageComponentSchema = z.object({
  src: z.string().default("https://via.placeholder.com/150"),
  animation: z
    .enum(["fadeIn", "zoomIn", "slideIn"])
    .default("slideIn")
    .describe("Animation effect for the image"),
  id: z.string().describe("Unique uuid  for the component"),
});

export const TransitionComponentSchema = z.object({
  type: z.enum(["fade", "wipe", "dissolve"]),
  duration: z.number(),
  id: z.string().describe("Unique uuid  for the component"),
});

export type AITextComponentType = z.infer<typeof TextComponentSchema>;
export type AIImageComponentType = z.infer<typeof ImageComponentSchema>;
export type AITransitionComponentType = z.infer<
  typeof TransitionComponentSchema
>;

const BaseSceneConfigSchema = z.object({
  id: z.string().describe("Unique uuid for the scene"),
  sceneProps: z.object({
    duration: z.number(),
    name: z.string().optional(),
    background: z.string().optional(),
  }),
  components: z.object({
    text: z.array(TextComponentSchema).optional(),
    image: z.array(ImageComponentSchema).optional(),
    transition: z.array(TransitionComponentSchema).max(1).optional(),
  }),
});

const SceneImprovementsSchema = z.object({
  suggestedImprovements: z
    .array(z.string())
    .min(3)
    .max(3)
    .describe("Suggested improvements for the scene")
    .default([]),
});

export const CreateSceneConfigSchema = BaseSceneConfigSchema.merge(
  SceneImprovementsSchema,
);

const ComponentActionSchema = z
  .enum(["update", "add", "remove"])
  .describe(
    "Action to perform on component: add (new), update (existing), remove (delete)",
  );

export const UpdateSceneToolSchema = z.object({
  id: z.string(),
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
              content: z.string(),
              animation: z.enum(["fadeIn", "slideIn", "zoomIn"]).optional(),
              action: ComponentActionSchema,
              id: z.string().describe("Unique uuid for the component"),
            }),
          )
          .optional(),
        image: z
          .array(
            z.object({
              src: z.string().optional(),
              animation: z.enum(["fadeIn", "zoomIn", "slideIn"]).optional(),
              action: ComponentActionSchema,
              id: z.string().describe("Unique uuid for the component"),
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
    originalScene: z
      .object({
        sceneConfig: BaseSceneConfigSchema,
      })
      .required(),
  }),
});

type UpdateSceneToolType = z.infer<typeof UpdateSceneToolSchema>;
export type AISceneConfigType = z.infer<typeof CreateSceneConfigSchema>;

export type AISceneUpdates = Omit<
  UpdateSceneToolType["update"],
  "originalScene"
>;

export type AiSceneUpdatesOriginalScene =
  UpdateSceneToolType["update"]["originalScene"]["sceneConfig"];
