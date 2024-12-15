import { Block, HighlightedCodeBlock } from "codehike/blocks";

import { z } from "zod";

export const VALID_TRANSITIONS = [
  "slide",
  "slide",
  "slide",
  "slide",
  "magic",
  "fade",
  "wipe",
  "none",
] as const;

export const TransitionType = z.enum(VALID_TRANSITIONS);
export type TransitionType = z.infer<typeof TransitionType>;

const BaseSchema = z.object({
  code: HighlightedCodeBlock,
  font: z.string().optional().default(""),
  transition: z.string().optional().default("--name=magic --duration=0.3"),
  codeBlockUtils: z.string().optional().default(""),
  media: z.string().optional().default(""),
});

export const SceneSchema = Block.extend(BaseSchema.shape);

export type Scene = z.infer<typeof SceneSchema>;

export const CodeTransitionCompositionPropsSchema = z.object({
  scenes: z.array(SceneSchema),
  styles: z.object({
    backgroundContainer: z.object({
      background: z.object({
        color: z.string().optional(),
        gradient: z.object({
          angle: z.number(),
          colors: z.array(z.string()),
        }),
        image: z.string().optional(),
        activeType: z.enum(["color", "gradient", "image"]),
      }),
    }),
    sceneContainer: z.object({
      inset: z.number().optional(),
      padding: z.number().optional(),
      borderRadius: z.number().optional(),
    }),
  }),
});

export type CodeTransitionCompositionProps = z.infer<
  typeof CodeTransitionCompositionPropsSchema
>;

export interface CompositionStore {
  content: string;
  scenes: Scene[];
  loading: boolean;
  error: string | null;
  setContent: (content: string) => void;
  setScenes: (scenes: Scene[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  duration: number;
  loadSavedContent: () => void;
  styles: z.infer<typeof CodeTransitionCompositionPropsSchema>["styles"];
  setStyles: (
    styles: z.infer<typeof CodeTransitionCompositionPropsSchema>["styles"],
  ) => void;
}
