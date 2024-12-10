import { CODE_COMP_TRANSITION_DURATION } from "./code-video-composition/config";
import type { Scene } from "./code-video-composition/types.composition";

export const calculateCompositionDuration = (steps: Scene[]): number => {
  return steps.reduce((acc, step) => {
    return (
      acc +
      step.duration -
      (step.transition && step.transition !== "magic"
        ? CODE_COMP_TRANSITION_DURATION
        : 0)
    );
  }, 0);
};
