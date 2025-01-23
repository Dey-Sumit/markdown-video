import { z } from "zod";

// Define our component schemas
export const TextComponentSchema = z.object({
  content: z.string(),
  animation: z.enum(["fadeIn", "slideIn", "zoomIn"]),
});

export const ImageComponentSchema = z.object({
  src: z.string().default("https://via.placeholder.com/150"),
  animation: z.enum(["fadeIn", "zoomIn", "slideIn"]),
});

export const TransitionComponentSchema = z.object({
  type: z.enum(["fade", "wipe", "dissolve"]),
  duration: z.number(),
});
export const SceneConfigSchema = z.object({
  id: z.string(),
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
  suggestedImprovements: z.array(z.string()).min(3).max(3).optional(),
});

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
    originalScene: z
      .object({
        sceneConfig: SceneConfigSchema,
      })
      .required(),
  }),
});
