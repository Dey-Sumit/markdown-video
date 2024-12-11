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
