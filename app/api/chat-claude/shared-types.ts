import { z } from "zod";

export const IdSchema = z.object({
  id: z.string().describe("Unique uuid for the component"),
});

// Define our component schemas
export const TextComponentSchemaWithoutId = z.object({
  content: z.string().describe("Content of the text"),
  animation: z
    .enum(["fadeIn", "slideIn", "zoomIn"])
    .default("fadeIn")
    .describe("Animation effect for the text"),
});

export const TextComponentSchema = TextComponentSchemaWithoutId.merge(IdSchema);

export const ImageComponentSchemaWithoutId = z.object({
  src: z.string().default("https://via.placeholder.com/150"),
  animation: z
    .enum(["fadeIn", "zoomIn", "slideIn"])
    .default("slideIn")
    .describe("Animation effect for the image"),
});

export const ImageComponentSchema =
  ImageComponentSchemaWithoutId.merge(IdSchema);

export const TransitionComponentSchemaWithoutId = z.object({
  type: z.enum(["fade", "wipe", "dissolve"]),
  duration: z.number(),
});

export const TransitionComponentSchema =
  TransitionComponentSchemaWithoutId.merge(IdSchema);

export const BaseSceneConfigSchemaWithoutIds = z.object({
  sceneProps: z.object({
    duration: z.number(),
    name: z.string().optional(),
    background: z.string().optional(),
  }),
  components: z.object({
    text: z.array(TextComponentSchemaWithoutId).optional(),
    image: z.array(ImageComponentSchemaWithoutId).optional(),
    transition: z.array(TransitionComponentSchemaWithoutId).max(1).optional(),
  }),
});

// export const SceneConfigSchemaWithId =
//   BaseSceneConfigSchemaWithoutIds.merge(IdSchema);

export const BaseSceneConfigSchemaWithIds = z.object({
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
});

const SceneImprovementsSchema = z.object({
  suggestedImprovements: z
    .array(z.string())
    .min(3)
    .max(3)
    .describe("Suggested improvements for the scene")
    .default([])
    .optional(),
});

export const CreateSceneArgsSchema = z
  .object({
    scenes: z.array(BaseSceneConfigSchemaWithoutIds),
  })
  .merge(SceneImprovementsSchema);

export type CreateSceneArgsType = z.infer<typeof CreateSceneArgsSchema>;

const ComponentActionSchema = z
  .enum(["update", "add", "remove"])
  .describe(
    "Action to perform on component: add (new), update (existing), remove (delete)",
  );

export const UpdateSceneToolSchema__OtherModel = z.object({
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
        sceneConfig: BaseSceneConfigSchemaWithoutIds,
      })
      .required(),
  }),
});

// updates and originalScene is at the same level
export const UpdateSceneToolSchema__Claude = z.object({
  id: z.string(),
  updates: z.object({
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
  }),
  originalScene: z
    .object({
      sceneConfig: BaseSceneConfigSchemaWithIds,
    })
    .required(),
});

type UpdateSceneToolArgsType__OtherModel = z.infer<
  typeof UpdateSceneToolSchema__OtherModel
>;

type UpdateSceneToolArgsType__Claude = z.infer<
  typeof UpdateSceneToolSchema__Claude
>;

export type AISceneConfigType = z.infer<typeof CreateSceneArgsSchema>;

export type AISceneUpdates = Omit<
  UpdateSceneToolArgsType__OtherModel["update"],
  "originalScene"
>;

export type AiSceneUpdatesOriginalScene__Claude =
  UpdateSceneToolArgsType__Claude["originalScene"]["sceneConfig"];

const a: AiSceneUpdatesOriginalScene__Claude = {
  id: "as",
  sceneProps: {
    duration: 5,
    background: "red",
  },
  components: {
    text: [
      {
        content: "Hello World",
        animation: "fadeIn",
        id: "text_component_001",
      },
    ],
  },
};

export type AITextComponentType = z.infer<typeof TextComponentSchemaWithoutId>;
export type AIImageComponentType = z.infer<
  typeof ImageComponentSchemaWithoutId
>;
export type AITransitionComponentType = z.infer<
  typeof TransitionComponentSchemaWithoutId
>;
