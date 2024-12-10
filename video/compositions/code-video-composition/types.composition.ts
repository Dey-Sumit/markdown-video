import { HighlightedCodeBlock } from "codehike/blocks";

import { z } from "zod";

export const VALID_TRANSITIONS = [
  "slide-from-left",
  "slide-from-right",
  "slide-from-top",
  "slide-from-bottom",
  "magic",
  "fade",
  "wipe",
  "none",
] as const;

export const TransitionType = z.enum(VALID_TRANSITIONS);
export type TransitionType = z.infer<typeof TransitionType>;

export const SceneSchema = z.object({
  code: HighlightedCodeBlock,
  duration: z.string().transform((v) => parseInt(v, 10)),
  fontUtils: z.string().optional(),
  transition: TransitionType.optional(),
  codeBlockUtils: z.string().optional(),
  media: z.string().optional(),
  transitionDuration: z.number().optional(),
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
