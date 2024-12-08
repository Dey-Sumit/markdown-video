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

const TransitionType = z.enum(VALID_TRANSITIONS);
export type TransitionType = z.infer<typeof TransitionType>;

export const StepSchema = z.object({
  duration: z.number(),
  fontUtils: z.string().optional(),
  transition: TransitionType,
  codeBlockUtils: z.string().optional(),
  media: z.string().optional(),
  transitionDuration: z.number().optional(),
  code: HighlightedCodeBlock,
});

export type Step = z.infer<typeof StepSchema>;

export const CodeTransitionCompositionPropsSchema = z.object({
  steps: z.array(StepSchema),
});

export type CodeTransitionCompositionProps = z.infer<typeof CodeTransitionCompositionPropsSchema>;

export interface StoreState {
  content: string;
  steps: Step[];
  loading: boolean;
  error: string | null;
  setContent: (content: string) => void;
  setSteps: (steps: Step[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  duration: number;
  loadSavedContent: () => void;
}
