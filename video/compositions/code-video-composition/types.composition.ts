import { HighlightedCodeBlock } from "codehike/blocks";

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

export const SceneSchema = z.object({
  code: HighlightedCodeBlock,
  duration: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default("5"), // 5 second
  font: z.string().optional().default(""),
  transition: z.string().optional().default("--name=magic --duration=3"), // ! setting the default of transition here also, as the propsParser does it's job in the slide component only, but we need this in the composition
  codeBlockUtils: z.string().optional().default(""),
  media: z.string().optional().default(""),
  transitionDuration: z.number().optional().default(0.3), // 0.3 seconds
});

export type Scene = z.infer<typeof SceneSchema>;

export const CodeTransitionCompositionPropsSchema = z.object({
  scenes: z.array(SceneSchema),
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
}
